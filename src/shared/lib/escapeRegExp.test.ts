import { escapeRegExp } from './escapeRegExp';

describe('escapeRegExp', () => {
  it('escapes every regex metacharacter', () => {
    expect(escapeRegExp('a.b*c+d?e^f$g{h}i(j)k|l[m]n\\o')).toBe(
      'a\\.b\\*c\\+d\\?e\\^f\\$g\\{h\\}i\\(j\\)k\\|l\\[m\\]n\\\\o',
    );
  });

  it('produces a pattern that matches the input literally', () => {
    const input = 'sunt (aut) facere?';

    expect(new RegExp(escapeRegExp(input)).test(`x ${input} y`)).toBe(true);
  });
});
