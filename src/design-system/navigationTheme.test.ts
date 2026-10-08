import { dark, light } from './generated/themes';
import { nativeTabsOptions, searchBarOptions, toNavigationTheme } from './navigationTheme';

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

describe('nativeTabsOptions', () => {
  it('colors the tab bar from the tokens', () => {
    const options = nativeTabsOptions(dark);

    expect(options.backgroundColor).toBe(dark.colors.bg.surface);
    expect(options.iconColor).toBe(dark.colors.text.muted);
    expect(options.tintColor).toBe(dark.colors.accent.default);
    expect(options.labelStyle.fontFamily).toBe(dark.fontFamily.medium);
    expect(options.labelStyle.color).toBe(dark.colors.text.muted);
  });

  it('uses the light palette for the light theme', () => {
    const options = nativeTabsOptions(light);

    expect(options.backgroundColor).toBe(light.colors.bg.surface);
    expect(options.selectedLabelStyle.color).toBe(light.colors.accent.default);
  });
});

describe('searchBarOptions', () => {
  it('styles the header search bar with the tokens', () => {
    const options = searchBarOptions(light, 'Search posts');

    expect(options.placeholder).toBe('Search posts');
    expect(options.textColor).toBe(light.colors.text.primary);
    expect(options.hintTextColor).toBe(light.colors.text.muted);
    expect(options.tintColor).toBe(light.colors.accent.default);
  });
});
