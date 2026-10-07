/**
 * @jest-environment node
 */
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { applyDesignSystem, DesignSystemError } from './applyDesignSystem';

const SOURCE = path.resolve(__dirname, '../../design-systems/posty');

async function setup() {
  const root = await mkdtemp(path.join(tmpdir(), 'ds-'));
  await cp(SOURCE, path.join(root, 'design-systems/posty'), { recursive: true });
  const options = {
    designSystemsDir: path.join(root, 'design-systems'),
    name: 'posty',
    outDir: path.join(root, 'src/design-system/generated'),
    fontsDir: path.join(root, 'assets/fonts'),
  };
  const dsFile = (file: string) => path.join(root, 'design-systems/posty', file);
  const editJson = async (file: string, edit: (json: Record<string, unknown>) => void) => {
    const parsed: unknown = JSON.parse(await readFile(dsFile(file), 'utf8'));
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed))
      throw new Error('bad fixture');
    const json: Record<string, unknown> = { ...parsed };
    edit(json);
    await writeFile(dsFile(file), JSON.stringify(json));
  };
  return { root, options, dsFile, editJson };
}

async function issuesOf(promise: Promise<unknown>): Promise<string[]> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof DesignSystemError) return error.issues;
    throw error;
  }
  throw new Error('Expected a DesignSystemError');
}

describe('applyDesignSystem', () => {
  let ctx: Awaited<ReturnType<typeof setup>>;

  beforeEach(async () => {
    ctx = await setup();
  });

  afterEach(async () => {
    await rm(ctx.root, { recursive: true, force: true });
  });

  it('generates light/dark themes, style props and fonts for a valid DS', async () => {
    const result = await applyDesignSystem(ctx.options);

    expect(result.status).toBe('written');
    const themes = await readFile(path.join(ctx.options.outDir, 'themes.ts'), 'utf8');
    expect(themes).toContain('export const light = {');
    expect(themes).toContain('export const dark: Theme = {');
    expect(themes).not.toContain('{palette.');
    const fonts = await readFile(path.join(ctx.options.outDir, 'fonts.ts'), 'utf8');
    expect(fonts).toContain(
      "'Inter-Regular': require('../../../assets/fonts/Inter_400Regular.ttf')",
    );
  });

  it('reports up-to-date in check mode after applying', async () => {
    await applyDesignSystem(ctx.options);

    await expect(applyDesignSystem({ ...ctx.options, check: true })).resolves.toMatchObject({
      status: 'up-to-date',
    });
  });

  it('reports drift in check mode when nothing was generated', async () => {
    const issues = await issuesOf(applyDesignSystem({ ...ctx.options, check: true }));

    expect(issues).toContain('themes.ts is out of date');
  });

  it('fails when the DS folder does not exist', async () => {
    const issues = await issuesOf(applyDesignSystem({ ...ctx.options, name: 'nope' }));

    expect(issues[0]).toMatch(/Folder not found/);
  });

  it('fails when a file declared in the manifest is missing', async () => {
    await rm(ctx.dsFile('tokens/scales.json'));

    const issues = await issuesOf(applyDesignSystem(ctx.options));

    expect(issues).toContain('Missing file declared in manifest: tokens/scales.json');
  });

  it('fails when an alias points to an unknown token', async () => {
    await ctx.editJson('tokens/posty-dark.json', (json) => {
      json.color = {
        ...Object(json.color),
        favorite: { $type: 'color', $value: '{palette.nope.1}' },
      };
    });

    const issues = await issuesOf(applyDesignSystem(ctx.options));

    expect(issues).toContain('dark: "color.favorite" references unknown token "{palette.nope.1}"');
  });

  it('fails when light and dark do not have the same keys', async () => {
    await ctx.editJson('tokens/posty-light.json', (json) => {
      json.color = { ...Object(json.color), extra: { $type: 'color', $value: '#000000' } };
    });

    const issues = await issuesOf(applyDesignSystem(ctx.options));

    expect(issues).toContain('dark theme is missing "color.extra"');
  });

  it('fails when a fontFamily is not declared in the manifest', async () => {
    await ctx.editJson('tokens/typography.json', (json) => {
      json.fontFamily = {
        ...Object(json.fontFamily),
        regular: { $type: 'fontFamily', $value: 'Comic' },
      };
    });

    const issues = await issuesOf(applyDesignSystem(ctx.options));

    expect(issues).toContain(
      'fontFamily.regular uses "Comic", which is not declared in manifest.fonts',
    );
  });
});
