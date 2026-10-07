# Posty — Domain glossary

| Term                   | Meaning                                                                                                                                              | Avoid               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **Post**               | A jsonplaceholder post (`id`, `userId`, `title`, `body`).                                                                                            | article, item       |
| **Comment**            | A comment belonging to a Post, fetched embedded in the Post detail.                                                                                  | reply               |
| **Post detail**        | A Post plus its Comments (`/posts/:id?_embed=comments`).                                                                                             |                     |
| **Favorite**           | A Post the user saved. Persisted locally as a **Favorite snapshot**.                                                                                 | bookmark, like      |
| **Favorite snapshot**  | Stored copy of a favorited Post (+ Comments) with `savedAt`/`syncedAt`. Lets favorites render offline; refreshed whenever the Post is fetched again. | cache               |
| **Search**             | Title filter. Server-side (`title_like`) in Posts, local over snapshots in Favorites.                                                                |                     |
| **Variant**            | Build flavor of the app: `development`, `staging`, `production` (`APP_VARIANT`).                                                                     | environment, flavor |
| **Design system (DS)** | A folder in `design-systems/<name>/` with DTCG tokens + fonts. Applied with `ds:apply`.                                                              | theme pack          |
| **Theme**              | `light` or `dark` inside the app, always with those names, whatever the DS calls them.                                                               |                     |
| **Token**              | A named design value (color, font size, spacing…). Style props accept token keys only.                                                               |                     |
| **Foundation**         | Human-led base: structure, API layer, stores, DS pipeline, variants, CI, base tests.                                                                 |                     |
| **Feature**            | AI-implemented, user-facing slice built on the Foundation's contracts.                                                                               |                     |
