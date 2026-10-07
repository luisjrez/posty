import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { z } from 'zod';

import { generateFonts, generateMeta, generateStyleProps, generateThemes } from './generate';
import { flatten, resolveAll, unflatten, type ResolvedTree } from './resolve';
import {
  ManifestSchema,
  REQUIRED_SHARED_GROUPS,
  REQUIRED_THEME_GROUPS,
  TokenGroupSchema,
  type Manifest,
  type Token,
  type TokenGroup,
} from './schema';

export class DesignSystemError extends Error {
  constructor(
    readonly designSystem: string,
    readonly issues: string[],
  ) {
    super(
      `Design system "${designSystem}" is invalid:\n${issues.map((i) => `  - ${i}`).join('\n')}`,
    );
    this.name = 'DesignSystemError';
  }
}

export type ApplyOptions = {
  designSystemsDir: string;
  name: string;
  outDir: string;
  fontsDir: string;
  check?: boolean;
};

export type ApplyResult = { status: 'written' | 'up-to-date'; files: string[] };

type GeneratedFiles = Map<string, string>;

export async function applyDesignSystem(options: ApplyOptions): Promise<ApplyResult> {
  const dsDir = path.join(options.designSystemsDir, options.name);
  const issues: string[] = [];

  if (!existsSync(dsDir)) throw new DesignSystemError(options.name, [`Folder not found: ${dsDir}`]);

  const manifest = await readJson(path.join(dsDir, 'manifest.json'), ManifestSchema, issues);
  if (!manifest) throw new DesignSystemError(options.name, issues);

  for (const file of [
    manifest.themes.light,
    manifest.themes.dark,
    ...manifest.tokens,
    ...manifest.fonts.map((f) => f.file),
  ]) {
    if (!existsSync(path.join(dsDir, file)))
      issues.push(`Missing file declared in manifest: ${file}`);
  }
  if (issues.length > 0) throw new DesignSystemError(options.name, issues);

  const shared = await readTokenFiles(dsDir, manifest.tokens, issues);
  const light = await readJson(path.join(dsDir, manifest.themes.light), TokenGroupSchema, issues);
  const dark = await readJson(path.join(dsDir, manifest.themes.dark), TokenGroupSchema, issues);
  if (!light || !dark) throw new DesignSystemError(options.name, issues);

  checkRequiredGroups(shared, REQUIRED_SHARED_GROUPS, 'shared tokens', issues);
  checkRequiredGroups(light, REQUIRED_THEME_GROUPS, 'light theme', issues);
  checkKeyParity(light, dark, issues);

  const lightTheme = buildTheme(shared, light, 'light', issues);
  const darkTheme = buildTheme(shared, dark, 'dark', issues);
  checkFontFamilies(manifest, lightTheme, issues);
  if (issues.length > 0) throw new DesignSystemError(options.name, issues);

  const fontsImportDir = toImportPath(path.relative(options.outDir, options.fontsDir));
  const files: GeneratedFiles = new Map([
    ['themes.ts', generateThemes(manifest, lightTheme, darkTheme)],
    ['styleProps.ts', generateStyleProps(manifest, lightTheme)],
    ['fonts.ts', generateFonts(manifest, fontsImportDir)],
    ['meta.json', generateMeta(manifest)],
  ]);

  if (options.check) {
    const drift = await findDrift(options, files, manifest, dsDir);
    if (drift.length > 0) throw new DesignSystemError(options.name, drift);
    return { status: 'up-to-date', files: [...files.keys()] };
  }

  await rm(options.outDir, { recursive: true, force: true });
  await mkdir(options.outDir, { recursive: true });
  for (const [file, content] of files) await writeFile(path.join(options.outDir, file), content);

  await rm(options.fontsDir, { recursive: true, force: true });
  await mkdir(options.fontsDir, { recursive: true });
  for (const font of manifest.fonts) {
    await copyFile(
      path.join(dsDir, font.file),
      path.join(options.fontsDir, path.basename(font.file)),
    );
  }

  return { status: 'written', files: [...files.keys()] };
}

async function readJson<T>(
  file: string,
  schema: z.ZodType<T>,
  issues: string[],
): Promise<T | null> {
  let raw: unknown;
  try {
    raw = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    issues.push(`${path.basename(file)}: cannot read JSON (${String(error)})`);
    return null;
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    issues.push(`${path.basename(file)}: ${z.prettifyError(result.error)}`);
    return null;
  }
  return result.data;
}

async function readTokenFiles(
  dsDir: string,
  files: string[],
  issues: string[],
): Promise<TokenGroup> {
  const merged: TokenGroup = {};
  for (const file of files) {
    const group = await readJson(path.join(dsDir, file), TokenGroupSchema, issues);
    if (!group) continue;
    for (const [key, value] of Object.entries(group)) {
      if (key in merged) issues.push(`Top-level group "${key}" is defined in more than one file`);
      merged[key] = value;
    }
  }
  return merged;
}

function checkRequiredGroups(
  tree: TokenGroup,
  required: readonly string[],
  where: string,
  issues: string[],
) {
  for (const group of required) {
    if (!(group in tree)) issues.push(`${where}: missing required group "${group}"`);
  }
}

function checkKeyParity(light: TokenGroup, dark: TokenGroup, issues: string[]) {
  const lightKeys = new Set(flatten(light).keys());
  const darkKeys = new Set(flatten(dark).keys());
  for (const key of lightKeys)
    if (!darkKeys.has(key)) issues.push(`dark theme is missing "${key}"`);
  for (const key of darkKeys)
    if (!lightKeys.has(key)) issues.push(`light theme is missing "${key}"`);
}

function buildTheme(
  shared: TokenGroup,
  mode: TokenGroup,
  label: string,
  issues: string[],
): ResolvedTree {
  const tokens = new Map<string, Token>([...flatten(shared), ...flatten(mode)]);
  const { values, issues: resolveIssues } = resolveAll(tokens);
  issues.push(...resolveIssues.map((issue) => `${label}: ${issue}`));
  return {
    colors: unflatten(values, 'color'),
    space: unflatten(values, 'space'),
    radius: unflatten(values, 'radius'),
    fontFamily: unflatten(values, 'fontFamily'),
    fontSize: unflatten(values, 'fontSize'),
    lineHeight: unflatten(values, 'lineHeight'),
    typography: unflatten(values, 'typography'),
  };
}

function checkFontFamilies(manifest: Manifest, theme: ResolvedTree, issues: string[]) {
  const declared = new Set(manifest.fonts.map((f) => f.family));
  const families = theme.fontFamily;
  if (families === undefined || typeof families !== 'object') return;
  for (const [key, family] of Object.entries(families)) {
    if (typeof family === 'string' && !declared.has(family)) {
      issues.push(`fontFamily.${key} uses "${family}", which is not declared in manifest.fonts`);
    }
  }
}

async function findDrift(
  options: ApplyOptions,
  files: GeneratedFiles,
  manifest: Manifest,
  dsDir: string,
): Promise<string[]> {
  const drift: string[] = [];
  for (const [file, expected] of files) {
    const target = path.join(options.outDir, file);
    const actual = existsSync(target) ? await readFile(target, 'utf8') : null;
    if (actual !== expected) drift.push(`${file} is out of date`);
  }
  const copied = existsSync(options.fontsDir) ? await readdir(options.fontsDir) : [];
  for (const font of manifest.fonts) {
    const name = path.basename(font.file);
    if (!copied.includes(name)) {
      drift.push(`font ${name} is missing in ${path.relative(dsDir, options.fontsDir)}`);
    }
  }
  if (drift.length > 0) drift.push(`Run: bun run ds:apply --ds=${options.name}`);
  return drift;
}

function toImportPath(relative: string): string {
  const posix = relative.split(path.sep).join('/');
  return posix.startsWith('.') ? posix : `./${posix}`;
}
