# Third-party notices

Original application code is licensed under the root MIT license. Dependency code is not relicensed by this project. Consult the installed packages' license files for binding terms and transitive dependencies.

| Dependency or resource                                                                             | License / attribution                                                                                  |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Next.js, React, Tailwind CSS, Anime.js, Framer Motion, Three.js, Supabase JS, clsx, tailwind-merge | MIT; preserve their distributed notices                                                                |
| GSAP and its plugins                                                                               | [GSAP Standard License](https://gsap.com/standard-license/); not covered by this project's MIT license |
| Babylon.js                                                                                         | Apache-2.0                                                                                             |
| Lucide                                                                                             | ISC                                                                                                    |
| MapLibre GL JS                                                                                     | BSD-3-Clause                                                                                           |
| MapCN component                                                                                    | MIT; Copyright (c) 2025 Anmoldeep Singh; full notice in `licenses/mapcn-MIT.txt`                       |
| sharp                                                                                              | Apache-2.0; bundled image libraries have their own notices                                             |
| Inter, Space Grotesk                                                                               | SIL Open Font License 1.1; downloaded by `next/font`                                                   |
| Map data and tiles                                                                                 | OpenStreetMap contributors and CARTO attribution remains visible on the map                            |

The MapCN wrapper in `src/components/ui/map.tsx` was installed through the MapCN registry and adapted for local worker hosting and geolocation error handling. See [MapCN](https://www.mapcn.dev/) and [its repository](https://github.com/AnmolSaini16/mapcn) for the upstream project. Generated MapLibre workers are copied from the installed dependency at build time and excluded from Git. Confirm the chosen map tile provider's production usage terms before deployment.
