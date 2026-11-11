# LEXORYN — The Living Intelligence Planet

**Public source edition:** supplied reference artwork is intentionally excluded. The generated cloud/city plate supplies public scene views. See [artwork policy](docs/PUBLIC_ARTWORK.md). The private Site preserves the approved original artwork separately.

Year 3186. “The planet where intelligence became civilization.”

## Run locally

Node 20.9+ is required by the installed Next.js version. From this directory:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4174. Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. The production build creates `out/`; preview it with `npm start`. This uses the included local Node static server, because Next.js App Router static exports are served as files rather than through `next start`.

## Architecture

- `app/`: server entry point, metadata and Tailwind visual system.
- `components/Expedition.tsx`: pinned GSAP ScrollTrigger choreography, five chapters, accessible climate profiles and preferences.
- `components/JourneyScene.tsx`: lazy R3F canvas, real perspective camera route, depth-separated cloud layers, cinematic image planes, scout paths and arrival platform.
- `components/PlanetSystem.tsx`: original displaced mesh, procedural GGX-inspired surface material, separate storm layer, atmospheric scattering approximation, broken moon, stations, satellite paths, drag and 3D hotspots.
- `data/world.ts`: editable canon, regional climate/technology/biology assumptions and typed Phase 2–4 extension contracts.
- `data/assets.ts`: centralized replaceable artwork registry.
- `lib/journey.ts`: bounded continuous camera path and chapter selectors.
- `references/`: policy notice; all 18 supplied originals remain in the owner’s preserved private archive.
- `docs/ART_DIRECTION.md`, `docs/ASSET_MANIFEST.md`, `docs/GENERATED_ASSETS.md`: continuity rules, full mapping and exact generated-plate provenance.
- `docs/VALIDATION.md`: final validation results and known limits.

## Controls and resilience

Drag the planet with a mouse; touch retains vertical scrolling. Click a surface node or named climate control to focus a region. Escape closes profiles/preferences. Chapter controls work by keyboard; Alt+Up/Down changes chapters when focus is outside a control. Reset restores the original camera and drag orientation. Pause freezes ambient rotation; scrolling continues to control the journey. System reduced motion freezes idle motion and removes optional transition movement. Performance mode lowers render density. Still-image mode preserves chapter navigation and regional climate information on devices without usable WebGL. Individual image-plate failures are isolated from the 3D planet, with the older approved city plate as an alternate.

## Scope and quality limits

This is the Phase 1 real-time cinematic foundation, not a claim of final film-quality rendering. Surface maps are procedural; the documented high-resolution texture slots remain upgrade targets. Atmospheric entry uses multiple real-depth shader clouds plus an actually generated scene plate, not a fluid simulation. The city is an approved image in 3D perspective with original mesh scout craft and observation rails; it is not yet an explorable city model. No crisis, placeholder cast or incomplete civilization UI has been added. Restrained bloom is enabled on desktop and bypassed in performance/mobile mode. True volumetric scattering and simulation-grade orbital physics are not claimed.

## Phase 2 extension

Build city exploration and district interactions on the arrival scene and typed regions/settlements/culture contracts. Add cohesive inhabitants, climate-specific architecture, farming, food, festivals, language, government, clothing and transport. Reuse the existing camera/asset registry and continuity rules; keep character mystery and branching crisis in Phases 3 and 4.
