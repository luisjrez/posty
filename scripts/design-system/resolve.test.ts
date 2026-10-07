import { flatten, resolveAll, unflatten } from './resolve';

describe('resolveAll', () => {
  it('resolves nested aliases and composite values', () => {
    const tokens = flatten({
      base: { size: { $type: 'number', $value: 16 } },
      alias: { size: { $type: 'number', $value: '{base.size}' } },
      text: {
        body: { $type: 'typography', $value: { fontSize: '{alias.size}', fontFamily: 'Inter' } },
      },
    });

    const { values, issues } = resolveAll(tokens);

    expect(issues).toEqual([]);
    expect(unflatten(values, 'text')).toEqual({ body: { fontSize: 16, fontFamily: 'Inter' } });
  });

  it('detects alias cycles', () => {
    const tokens = flatten({
      a: { $type: 'color', $value: '{b}' },
      b: { $type: 'color', $value: '{a}' },
    });

    expect(resolveAll(tokens).issues).toEqual(
      expect.arrayContaining([expect.stringMatching(/Alias cycle/)]),
    );
  });

  it('rejects a composite where a single value is expected', () => {
    const tokens = flatten({
      text: { body: { $type: 'typography', $value: { fontSize: 16 } } },
      size: { $type: 'number', $value: '{text.body}' },
    });

    expect(resolveAll(tokens).issues).toContain(
      '"size" references composite token "text.body" where a single value is expected',
    );
  });
});
