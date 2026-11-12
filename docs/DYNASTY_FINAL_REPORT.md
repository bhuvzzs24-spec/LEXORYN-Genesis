# Alien Dynasty delivery and visual-quality report

Baseline: `25478ed98c6404bfefa4a4f709f57991159be710`.

## Completed implementation

- All56 scenes retained, with the existing mineral-world shader, rotation/drag, regional controls, weighted manual scroll and responsive final-orbit camera.
- Revised15-entry cast registry:7Vaelori,2Myr,4humans,1robot and ORIGIN. All14 embodied figures have full-body artwork and separate portraits. Successful original Aaryan body/portrait and Nyra body were preserved; remaining cast replacements are original generated identities, not actor photographs.
- Species bible,60/23/17 fictional population targets, political history, native ecological sovereignty, human minority communities, regional institutions and species-specific preparation of all six foods.
- Scene49 uses the new imperial storm balcony, with independent flight and atmosphere effects. Reused ring machinery removed there and from council/archive compositions; actual Codex machinery retained in relevant scenes.
-16alien civilization plates,24individual high-detail inspection assets, a new three-cell comic strip and three conditional ending plates. Food, gear, footwear and clothing no longer rely on small atlas cells in active inspections. Foreground cutouts use genuine alpha.
- Default autoplay samples every scene for exactly4seconds:224seconds total, transitions included. Adjacent scene blending occupies the final portion of each interval. Scene42 holds a stable Myr introduction; additional profiles are selectable.
- Next-scene preloading, shared texture leases with delayed unused-GPU-cache cleanup, responsive delivery copies, existing accessibility/reduced-motion controls and comic loading-error text fallback.

## Source counts and native resolution

70new generated source images are integrated as115WebP delivery files, including responsive copies. Native masters remain outside the public repository under the workspace `work/dynasty*-masters/` folders. No source was upscaled or falsely labeled4K.

| Group | Source count | Actual native dimensions |
|---|---:|---|
| Cast plus storm balcony |26| Bodies941×1672 or1024×1536; portraits1086×1448,1199×1312,1190×1322,1166×1349 or1145×1374; balcony1672×941 |
| Civilization |16|1672×941 |
| Crisis/comic |4| Strip2172×724; three endings1672×941 |
| Individual inspection items |24| Foods1254×1254; other objects1254×1254,1536×1024 or1774×887; wardrobe941×1672,1024×1536 or864×1821 |

Source decoding, dimensions, alpha, file existence and production-export byte equality were checked for all115 deliveries. Source images were reviewed during generation; seven completed but unregistered outputs were recovered and inspected without regenerating them. Exact final interrupted-batch prompts were not retained; recovered-file provenance documents filenames and SHA256 without inventing prompt records.

## Validation performed

- TypeScript: passed.
- ESLint with zero warnings: passed.
- All29automated tests: passed.
- Production build/static export: passed.
- Tests cover all56 scene IDs, four-second timing boundaries through224000ms, region/camera continuity, projected final-planet framing at desktop/portrait/ultrawide aspects, all24valid ordered crisis permutations and all three default endings, distinct outcome assets, species/diets and asset existence.
- The new browser acceptance pass was NOT run. Automatic approval review previously blocked localhost interaction; the user explicitly directed finishing available checks and reporting that blocker. No alternative browser or raw browser-control workaround was used. No claim of measured60fps or final film quality is made.

## Remaining limitations

- Figures and crowds are photographic cutout/still artwork with restrained parallax, not rigged body/facial performances. The existing real-time vehicles are procedural geometry, not newly supplied film-resolution vehicle models. Their flight paths and independent motion are preserved; orbital station details and a Myr ecological satellite were adapted.
- Successful unpopulated skyline, skyway, transit, storm, laboratory, archive and hangar sources were retained. They remain native1672×941. The overall project is not native4K.
- The limited-graphics orbit poster is an older1280×720 previsualization, visibly labeled archived; it does not match the current live mineral-world shader and still needs a matching real3D capture when browser access is restored.
- Named full-body/portrait continuity is based on original generated identity references. Exact individual identity in small background crowd and comic figures is not guaranteed; unnamed technical workers should not be represented as verified actor or hero likeness matches.
- Live desktop/mobile layout, WebGL/console checks, actual stopwatch playback and interaction/fault-injection regression for this redesign remain unverified due to the browser gate. Automated checks do not replace these acceptance checks.

No hosted website was published or replaced. Restricted references, credentials, native PNG masters, build caches and exports are excluded from GitHub delivery.
