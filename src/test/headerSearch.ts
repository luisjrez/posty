import { fireEvent, screen } from '@testing-library/react-native';

// The native header search bar has no JS input in Jest; it renders as the `RNSSearchBar`
// host view, so typing means emitting the native `changeText` event on it.
export async function typeInHeaderSearch(text: string) {
  const [searchBar] = screen.container.queryAll((element) => element.type === 'RNSSearchBar');
  if (searchBar === undefined) throw new Error('No native header search bar is rendered');
  await fireEvent(searchBar, 'changeText', { nativeEvent: { text } });
}
