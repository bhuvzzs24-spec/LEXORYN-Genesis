# Phase 2 validation — 11 November 2026

## Checks

Both the owner-private checkout and public-safe GitHub edition pass TypeScript strict validation, ESLint with zero warnings, nine Node tests, and the Next.js production static build. Tests cover the preserved Phase1 camera/canon/assets, all28 unique scenes and chapter boundaries, weighted navigation, finite continuous reversible camera sampling, concise cultural inspections and14 real generated plate/mobile file pairs. Native images were decoded with Pillow; all14 masters are1672×941, mobile copies960×540, no upscaling. The original3D fallback render is1280×720.

## Actual browser verification

Production export served on127.0.0.1:4174, inspected through the in-app Chromium browser at1280×720 desktop and390×844 mobile viewport. This was viewport emulation, not a physical-phone test. All28 navigator destinations were clicked and verified against current stage IDs and captions; evidence is saved in the task outputs `phase2-browser-scenes.json`.

- Genuine Three.js r181 planet visibly rendered with moon, station, surface/cloud layers and night lights. Idle rotation changed; pause held motion; dragging changed orientation. Climate navigation reached scene15; Pyravar opened its profile and focused camera to[1.25,.3,6.4], with regional surface orientation. Reset returns to orbit.
- City08 scroll: local progress.1801→.4358 changed actual camera[-.2292,.1993,11.6402]→[-.1803,.3155,10.7913] and independent craft[-13.175,-.053,3.401]→[-2.662,1.088,1.171]. A later read while stopped retained positions. Equal reverse scroll restored the original values. This verifies real independent spatial movement, not a whole-photo CSS transform.
- All28 scene destinations rendered; major views fill the stage. The three climate screenshots show distinct hot amber, ice-blue/aurora and wet storm lighting. Cuisine and costume inspector thumbnails decode and carry a still/concept-study label. The public edition disables those supplied thumbnails while preserving text.
- Atmospheric entry and storm layers rendered. Browser QA exposed baked-in lettering in the older cloud/city plate; active scenes06/07 now use a separately generated clean cloud plate. The clean replacement was individually inspected and rendered again. Shared current-scene planes crossfade and camera endpoints blend; the world/orbit hand-off has a reversible veil.
- Festival scene has2400 instanced drones desktop,640 mobile. Scrolling.180→.552 increased launched count671→2107 on desktop. Fauna scene reports5 native mist-skates desktop/2mobile; Myr and large wildlife in the painting remain static.
- Audio button enabled then muted the original synthesized soundscape; no autoplay or external recording. Highlight playback drives selected-scene scroll automatically and has a stop control.
- Mobile stage measured390×844 with no horizontal overflow. Navigator, costume inspection, climate controls and preferences remain available. Breakpoint resize preserved current scene/progress. Navigator Shift+Tab wrapped to its last control inside the dialog; Escape closed it and returned focus to Explore.
- Reduced motion and still-image mode were exercised. In still mode the canvas unmounts, an explicitly identified original-render poster appears in orbit, and scene/climate text controls remain usable. No artificial CSS planet replaces the live default.
- No console errors or warnings were observed during the final scene inspection. All runtime assets exist. Texture failures are isolated by boundaries keyed per asset so one failed texture cannot suppress subsequent scenes. Arbitrary network failure and automatic GPU-context loss were code-reviewed, not fault-injected in this browser session.

## Review fixes

Fixed mobile camera endpoint discontinuity, weighted chapter progress bars, persistent image-error boundary state, orbit/world mode cuts, breakpoint pin reset, missing debris motion, caption staleness after long jumps, navigator keyboard focus, interrupted rapid skip navigation, and cuisine framing. Primary movement remains a direct function of scroll. The planet is kept mounted once across scenes and recreated only for explicit reset.

## Limits and next-phase work

These are cinematic layered still environments with real separate mesh vehicles, foreground architecture, weather, mechanisms, drone instances and modest distant fauna. The capital is not a fully modeled walkable city. Several city beats share one plate. People, Myr and large wildlife are painted stills, not production rigged characters. Accessory concept details are stills, not rotatable models. No claim of4K, final film-quality rendering, fluid simulation, benchmarked frame rate or tested Safari/Firefox behavior is made.

No mandatory visual asset slot is missing for the current28-beat implementation. Optional upgrades: authored4K environment/depth mattes, original PBR planetary channels, production glTF transport/costume/creature models, rigged Myr/large fauna, and rights-cleared detail imagery suitable for public redistribution. Phase3 should add the actual Night of Convergence and original character/mystery work through the existing scene registry; no ceremony, crisis or branching ending was implemented here.

## Preservation and distribution

Phase1 source/history was preserved before edits in a local bundle and the existing release ZIP. Raw supplied references were retained without source overwrites. Public asset allowlist audit found exactly30 original generated/render files: the historical generated plate,28 current plate/mobile files and one original-render poster. No supplied reference binary/crop/preview enters public GitHub. Credential-pattern scanning found none in source/docs/tests; dependencies and build outputs remain ignored. Publication and GitHub push receipts are recorded separately after the verified actions.
