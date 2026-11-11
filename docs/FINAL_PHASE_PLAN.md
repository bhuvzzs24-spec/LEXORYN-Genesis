# Final Phase3 / three-part delivery

The final request consolidates the original four-phase roadmap's character/mystery and survival deliverables into a final Phase3. The historical `world.phases` contract is retained; it is not a claim that another UI phase must be implemented. Scenes01–28 and their original artwork are preserved. Scenes29–56 extend the same pinned R3F stage, scroll controller, assets and navigation.

## New runtime modules

- `data/finale-story.ts`: four new seven-scene chapters; `data/story.ts` includes all56.
- `data/characters.ts` and `data/character-assets.json`:12 fictional identities, six hero alpha sources and a five-person supporting atlas; ORIGIN uses the real-time core.
- `FinaleWorld.tsx`: separate photographic character planes, real hangar geometry, a moving gantry, independent concentric machinery, energy conduits, procedural Aeric light choreography and sensory filaments. Photographic bodies are not rigged or lip-synced.
- `FinaleOverlay.tsx`: optional cast notes, signal/record discoveries, regional emergency selectors, council commitments, seven resource consequences, outcome-specific four-panel comic, endings and restart.
- `data/crisis.ts`: organizer-replaceable crisis card, initial resources, timed hazards, decisions, thresholds and comic mappings.
- `lib/crisis.ts`: pure deterministic simulation and replay validation. Three distinct commitments, each applied once. No random outcome selection. Decisions persist locally; resources are recomputed from history. Three different default outcomes are reachable; additional failure/fragile thresholds support replacement cards.
- `lib/finale.ts`: regional emergency visuals and the3:48 showcase route. Showcase simulation is explicitly marked, does not mutate saved player decisions, and stops on manual wheel/touch input or its toggle.

## Reference review and distribution

The original Downloads reference paths were unavailable. All85 retained reference images in the private project references folder were reviewed via private contact sheets and the cast/environment production passes. These include architecture, vehicles, textiles, foods, jewelry, footwear, native ecology, actors/portraits and storyboards. The established graphite/titanium/aged-bronze construction, restrained cyan instruments and regional materials carry forward. Actor references were not copied into public character assets; new fictional faces were generated instead. No supplied artwork or derivative reference thumbnail is added to GitHub.

New original WebPs are under `public/assets/finale/`. Their exact prompts, source hashes, native dimensions and limitations are in CHARACTER_CONTINUITY.md and FINALE_ENVIRONMENTS.md. Original PNG masters are preserved locally outside public and are not overwritten. The far environments are native1672×941, not4K. Supporting cast is1983×793 with equal transparent cells; hero body images are941×1672 or1024×1536. Runtime planes retain native aspect ratios. Comic frames crop a native triptych and use an outcome-selected fourth image.

## Scene-to-asset mapping

| Scenes | Environment and independent elements |
| --- | --- |
|29|New Convergence night aerial; existing2400/640 festival drone system, separate spatial light choreography and traffic|
|30|New living ceremonial procession; region-specific costumes, independent lantern choreography and camera progression|
|31|Preserved original civic cuisine plate and six separate food planes; hover/focus/lift/pin inspections|
|32|Night capital, procedural Aeric light structures and ceremonial instrument geometry|
|33|New Myr cooperative ceremony; foreground sensory filaments, particles and perspective travel|
|34–35|Night capital; independent mechanical synchronization, light choreography, traffic; mysterious signal and low-frequency sound change|
|36–37|Preserved capital environment seen through actual hangar structure; gantry/traffic behind separate Aaryan/Kaor cutouts|
|38|Preserved research habitat, Sorya cutout and rotating diagnostic machinery|
|39|New Codex engineering environment, Nyra cutout and independent modular machinery|
|40–41|New archive / preserved council; Elara / Vaelora cutouts and spatial camera|
|42–43|Preserved commons/council; selectable support atlas characters, ORIGIN machinery, reused hero identities and projected council machinery|
|44–47|New archive and Codex core, actual concentric mechanisms, conduits, energy lights and extended camera descent|
|48–50|New Myr/native environment and storm emergency, objective conflict, real machinery/traffic/weather|
|51|Preserved original desert/polar/storm plates selected by scroll or region control, distinct environmental effects|
|52–53|Council commitments, mechanical network and deterministic resource ledger; selected outcome changes environment|
|54|Three original consistent warning/disaster/decision comic cells plus the selected outcome's aftermath|
|55|Central, regional or covenant aftermath selected by the actual thresholds, no random ending|
|56|Existing original interactive3D planet, final line, restart and alternate-outcome controls|

## Organizer adaptation

Change the typed `crisisConfig` in `data/crisis.ts`: id/title/description/regions/initial/hazards/rounds/decisions/outcomes/comic. Set a new id when changing the card so previous saved choices reset safely. Keep decision IDs unique and provide at least the configured number of decisions. Outcome thresholds are evaluated in listed order, then `fallbackOutcome`. `world` and `regions` in `data/world.ts` remain the planet-card canon; scene captions, artwork and camera nodes are separate configuration. No change to the renderer or reducer is necessary for new initial conditions, decision consequences or outcome thresholds.

## Known fidelity limits

This is a functional cinematic layered-image /3D hybrid. Cast bodies, crowd members, native Myr and some environmental architecture remain photographic stills; they have perspective staging, not skeletal animation. Real-time geometry supplies foreground machinery, gantries, craft, drones, atmospheric effects and the planet. No native4K, movie-footage, full character animation or60fps guarantee is asserted. No hosting publication is authorized for this delivery.
