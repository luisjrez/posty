import { dark, light } from './generated/themes';
import { toNavigationTheme } from './navigationTheme';

describe('toNavigationTheme', () => {
  it('derives navigation colors and fonts from the tokens', () => {
    const theme = toNavigationTheme(dark, true);

    expect(theme.dark).toBe(true);
    expect(theme.colors.background).toBe(dark.colors.bg.canvas);
    expect(theme.colors.primary).toBe(dark.colors.accent.default);
    expect(theme.fonts.regular.fontFamily).toBe(dark.fontFamily.regular);
  });

  it('uses the light palette for the light theme', () => {
    expect(toNavigationTheme(light, false).colors.card).toBe(light.colors.bg.surface);
  });
});
