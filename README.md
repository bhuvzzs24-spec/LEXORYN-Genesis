# LEXORYN — The Living Intelligence Planet

Year3186. The planet where intelligence became civilization.

The existing Phase1 planet and descent now open a shared full-viewport story:28 scenes across orbit, Velair Prime, three climates and daily life. Phase2 ends with Convergence preparations. The ceremony, hero cast and crisis remain later-phase work.

## Run locally

Use Node20.9+ and the committed lockfile:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4174. Validate with `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. The static production export is `out/`; serve it with `npm start`.

## Story engine

- `components/story/CinematicStoryController.tsx`: one GSAP-pinned full-screen stage, weighted reversible scroll, chapter/28-scene navigation, judge highlight playback, captions, inspection and preferences.
- `FullscreenCinematicScene.tsx` and `ScrollCameraRig.tsx`: one persistent R3F canvas, actual perspective camera, a continuous C1 camera route, independent image failure boundaries and scene layers.
- `WorldLayers.tsx`: original mesh spacecraft, trains, skimmers, bikes, crawlers, cargo; separate shader weather, spatial civic mechanisms and instanced festival drones.
- `NativeDrifters.tsx`: modest original distant fauna with separate spatial flight and membrane flexion.
- `components/PlanetSystem.tsx`: mineral-rift alien surface/cloud/atmosphere shaders, real sphere, idle rotation, drag, climate focus, station, satellites and fractured moon/debris.
- `data/story.ts` / `lib/story.ts`: all28 scenes, camera keyframes, timing, climates, mobile metadata, six foods, six costume traditions and ten everyday object inspections.
- `data/story-media.json` / `SceneAssetRegistry.ts`: replaceable optimized imagery. Fourteen actual generated1672×941 environmental plates plus smaller mobile copies; no upscaling or 4K claim.
- `LayeredEnvironment.tsx`, `SceneObjectLayer.tsx` and `InspectionExhibit.tsx`: independently moving architecture, transparent atlas objects, pointer/keyboard focus, lift, pin and dismissal.
- `data/visual-assets.json` / `docs/VISUAL_OVERHAUL_ASSETS.md`: eight additional native environmental plates, four alpha architecture layers, four alpha object atlases, original generation provenance and replacement boundary.
- `lib/cinematography.ts` / `useCinematicScroll.ts`: continuous weighted camera interpolation and one bounded scroll clock shared by all moving layers.
- `data/world.ts`: editable planetary canon and extension contracts. Original Phase1 components/route helpers remain preserved alongside the active engine.
- `docs/WORLD_BIBLE.md`, `SCENE_ASSET_MAP.md`, `PHASE2_GENERATED_ASSETS.md`: continuity, every scene/layer/quality limit, exact prompts and source hashes.

## Controls

Scroll forward/backward to move camera, craft, clouds and mechanisms; the same progress produces the same primary positions. Stop scrolling to hold them. Ambient drift can continue. Drag the planet with a mouse; touch retains vertical scrolling. Use regional climate inspections, reset camera, previous/next scene, chapter controls or Explore to jump anywhere. Alt+Up/Down changes scenes. Escape closes overlays. The navigator traps keyboard focus and restores it on close. Judge highlights drive nine selected scenes without manual scrolling.

Pause freezes ambient drift. Reduce motion respects the operating system, removes entry vibration/lightning and freezes ambient drift while retaining explicit scroll control. Performance mode lowers render density/particles; mobile uses smaller textures. Still-image mode preserves all scene navigation and text inspections without WebGL. Audio is an optional original synthesized soundscape, starts only from a button gesture, and has mute controls; it uses no third-party recordings.

## Visual and distribution limits

Large environments are generated still plates with real separate foreground geometry, vehicles, weather and perspective motion. They are not fully explorable modeled cities or fluid simulations. Multiple city beats intentionally share the capital plate, with different camera paths and mechanisms. Human/Myr figures and large wildlife in the plates are static. Objects without models are explicitly labeled still concept studies, never falsely advertised as rotatable3D. The mist-skates are small procedural fauna, not production rigged hero creatures. Optional upgrade slots include authored4K environment/depth layers, production vehicle/creature meshes and detailed planetary material maps.

Supplied reference artwork and derivatives are preserved locally/private; public GitHub excludes their binaries because redistribution rights are not established. Public story plates are newly generated imagery with documented provenance; the public edition disables supplied concept-detail thumbnails. Font license notices remain alongside Cinzel and Manrope. See `docs/VISUAL_OVERHAUL_VALIDATION.md` for the overhaul validation, `docs/PUBLIC_ARTWORK.md` for the public edition policy and `docs/VALIDATION.md` for the tested behavior and limits.
