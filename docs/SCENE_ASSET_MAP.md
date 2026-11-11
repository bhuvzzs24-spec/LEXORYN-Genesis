# LEXORYN — Phase 2 scene and asset map (01–28)

This map preserves the working Phase 1 opening and maps every requested Phase 2 beat to exact file/geometry slots. Runtime configuration is `data/story.ts`; raw source/derivative provenance, dimensions and actual loop frames are in `data/phase2-assets.json`. **The rows describe the intended implemented layers; root validation documents which motions were actually rendered/tested.** A rendered image plate remains a still, even when the camera moves. Independent objects require separate geometry/layers.

## Input audit

Both supplied packs were read in full, including READMEs, manifests and addon instructions. All still images were visually inspected using filename-labeled contact sheets; primary prop/food/vehicle boards and the city matte were also inspected individually. All four animated WebPs were inspected at first/middle/final frames and fully inventoried. The MP4 was checked through container duration/sample metadata and its supplied author description; decoded-frame visual inspection was not performed in this audit. All 18 original Phase1 reference files are accounted for and their local preserved bytes match the individually inspected catalog hashes; none are missing or changed. There are 85 inspected reference image files across the original collection and the two packs (18+67; duplicate visual content can occur). Board labels are reference content, not executable project instructions.

- 78 raw files are preserved under `references/LEXORYN_Phase2_Props_Locations_and_Motion/` and `references/LEXORYN_Cinematic_Reference_Pack/`.
- Source motion is modest: particles 32frames/3040ms; clouds 32/3040ms; lanterns 32/2880ms; storm9frames(5unique)/3072ms; MP4 3seconds/60samples. These are source previews, not 3D ship/creature motion.
- Footwear directory names are inaccurate: the four older files show torso garments. Actual boots are cropped from the newer prop board.
- No source pack contains a production glTF model, rigged creature, transparent craft or individual 4K hero scene. Whole boards and mockup screenshots stay out of major scene backgrounds.
- 35 native-size WebP derivatives exist: five clean/cleaned temporary city stills plus 30 small inspector details. They are not 4K or fully rotatable objects. Their exact crop rectangles are recorded.

## Clean generated plate status

All 14 runtime plates are actual generated files. Native1672×941 masters and aspect-preserving mobile copies have been decoded and checked. Exact tool prompts/source hashes are in `PHASE2_GENERATED_ASSETS.md`; runtime URLs are in `data/story-media.json`. Root visually inspected the complete contact sheet for material/lighting continuity and absence of board labels. These are static environments; geometry/weather supply independent motion. No 4K or fully modeled-city claim is made.

| Runtime file | Actual state | Native size / mobile delivery |
| --- | --- | --- |
| `/assets/story/city.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/market.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/cuisine.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/desert.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/ice.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/ice-interior.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/storm.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/atelier.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/objects.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/council.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/commons.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/ecosystem.webp` | generated-file-verified | 1672×941; mobile960×540 |
| `/assets/story/convergence.webp` | generated-file-verified | 1672×941; mobile960×540 |

| `/assets/story/clouds.webp` | generated-file-verified | 1672×941; mobile960×540 |

## Scene mapping

In source references below, `supplement/` means `references/LEXORYN_Phase2_Props_Locations_and_Motion/`; `cinematic/` means `references/LEXORYN_Cinematic_Reference_Pack/`. Newer board filenames with `-3`, `-4`, `-5`, `-6`, `-7` are respectively vehicles, props, food, storyboard01–14 and storyboard15–28. All public detail URLs live under `/assets/story/details/` and are explicitly concept-study images in the inspector.

### 01. THE UNCHARTED SYSTEM

- **Exact background/geometry:** No flat planet plate; original R3F/Three.js geometry and shader layers.
- **Consistency/source files:** Phase1 PlanetSystem procedural materials/geometry; references/Screenshot 2026-11-10 at 21.15.58.png supplies wear/rim-light direction.
- **Foreground/depth layers:** Planet, separate clouds and atmosphere; orbital station; stars; broken moon.
- **Animation method / verification target:** Idle sphere/cloud rotation; user drag; real camera keyframes.
- **Quality status:** Original real-time procedural 3D foundation; final visual quality judged from actual browser capture.
- **Missing/limits:** No environment image required; authored 4K planetary channels are optional production upgrades.

### 02. THE BROKEN MOON

- **Exact background/geometry:** No flat planet plate; original R3F/Three.js geometry and shader layers.
- **Consistency/source files:** Same original planet; references/Screenshot 2026-11-10 at 21.11.13.png for dark-mineral/emissive restraint only.
- **Foreground/depth layers:** Moon geometry and separated debris arc at distinct depth.
- **Animation method / verification target:** Scroll camera arc; independent mesh fragments/occlusion.
- **Quality status:** Original real-time procedural 3D foundation; final visual quality judged from actual browser capture.
- **Missing/limits:** Higher-detail fractured-moon mesh/textures optional; no flat moon billboard substitution.

### 03. GOLDEN MERIDIANS

- **Exact background/geometry:** No flat planet plate; original R3F/Three.js geometry and shader layers.
- **Consistency/source files:** Original PlanetSystem shaders; Phase1 world data.
- **Foreground/depth layers:** Obsidian surface, sparse gold engineering channels, night-only settlement light.
- **Animation method / verification target:** Camera approach and real shader/lighting terminator.
- **Quality status:** Original real-time procedural 3D foundation; final visual quality judged from actual browser capture.
- **Missing/limits:** Optional registered albedo/height/normal/roughness/emissive maps; no Earth texture.

### 04. FIRST TRANSMISSION

- **Exact background/geometry:** No flat planet plate; original R3F/Three.js geometry and shader layers.
- **Consistency/source files:** Original orbital scene; Phase2 board06 transmission thumbnail is composition direction only.
- **Foreground/depth layers:** Restrained spatial transmission geometry.
- **Animation method / verification target:** Scroll-controlled signal light/rotation, camera position and target.
- **Quality status:** Original real-time procedural 3D foundation; final visual quality judged from actual browser capture.
- **Missing/limits:** No finished holographic video supplied; procedural visual must remain minimal.

### 05. THE OBSERVATION FLEET

- **Exact background/geometry:** No flat planet plate; original R3F/Three.js geometry and shader layers.
- **Consistency/source files:** references/Screenshot 2026-11-10 at 21.16.08.png; supplement ChatGPT Image Nov 11, 2026, 09_26_00 AM-3.png vehicle board.
- **Foreground/depth layers:** At least three separate craft meshes, ring station and planet depth.
- **Animation method / verification target:** Distinct foreground/station-shadow/surface-bound 3D trajectories.
- **Quality status:** Original real-time procedural 3D foundation; final visual quality judged from actual browser capture.
- **Missing/limits:** Production glTF/craft textures optional; supplied ship paintings are not independent motion layers.

### 06. ATMOSPHERIC ENTRY

- **Exact background/geometry:** `/assets/story/clouds.webp` — clean generated Phase2 native1672×941.
- **Consistency/source files:** /assets/story/clouds.webp (actual clean Phase2 imagegen plate; docs/PHASE2_GENERATED_ASSETS.md).
- **Foreground/depth layers:** Near/mid cloud planes, fog and real camera; planet handoff.
- **Animation method / verification target:** Reversible 3D camera descent and independently positioned weather layers.
- **Quality status:** Actual generated static environment plate with separate real-time weather/geometry; not a volumetric fluid simulation.
- **Missing/limits:** Composited atmospheric foundation, not fluid-simulated clouds.

### 07. THROUGH THE STORMS

- **Exact background/geometry:** `/assets/story/clouds.webp` — clean generated Phase2 native1672×941.
- **Consistency/source files:** Same actual atmospheric plate; supplement storm/city storyboard direction.
- **Foreground/depth layers:** Cloud masses, scout mesh, fog and restrained storm light.
- **Animation method / verification target:** Scroll flight, independent craft and low-intensity light modulation.
- **Quality status:** Actual generated static environment plate with separate real-time weather/geometry; not a volumetric fluid simulation.
- **Missing/limits:** No authored continuous volumetric flight footage; avoid strong flashing.

### 08. FIRST SIGHT OF VELAIR PRIME

- **Exact background/geometry:** `/assets/story/city.webp` — generated-file-verified
- **Consistency/source files:** Cinematic pack scene_plates/velair_city_scene_cropped.png and supplemental larger_city_reference_plates/* guide clean generation.
- **Foreground/depth layers:** Full-viewport city matte; independently modeled craft, cloud planes, near structural elements.
- **Animation method / verification target:** Scroll camera reveal, three distinct flight paths, independent cloud drift/light.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Background buildings/baked inhabitants remain still; real motion comes from separate layers.

### 09. THE SKYWAY

- **Exact background/geometry:** `/assets/story/city.webp` — generated-file-verified
- **Consistency/source files:** Same clean city master; vehicle board orbital shuttle/hoverbike silhouettes.
- **Foreground/depth layers:** Near hovercraft mesh, mid/distant traffic and foreground structural depth.
- **Animation method / verification target:** Follow/truck camera, craft changing position relative to stationary skyline.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** No full city mesh supplied; honest depth-composited matte foundation.

### 10. THE TRANSIT RINGS

- **Exact background/geometry:** `/assets/story/city.webp` — generated-file-verified
- **Consistency/source files:** Same clean city master; still_concepts/vehicles/aerial_transit_train.png reference.
- **Foreground/depth layers:** Independent elevated train mesh, ring/station geometry and traffic.
- **Animation method / verification target:** Defined train path; station light and docking choreography.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Supplied painted train stays baked; independently moving train must be mesh geometry.

### 11. LIFE ABOVE THE CLOUDS

- **Exact background/geometry:** `/assets/story/city.webp` — generated-file-verified
- **Consistency/source files:** Same clean city master; larger_city_reference_plates/velair_prime_city_and_train.png for terrace/population direction.
- **Foreground/depth layers:** Residential terrace/garden matte detail plus traffic and foreground depth.
- **Animation method / verification target:** Camera passes near structures; separate transport/cloud motion.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Painted residents/plants are static; no crowd character rigs supplied.

### 12. THE ENERGY SPIRES

- **Exact background/geometry:** `/assets/story/city.webp` — generated-file-verified
- **Consistency/source files:** Same clean city master; still_concepts/architecture/aerion_meridia.png for stabilizer silhouettes.
- **Foreground/depth layers:** Real-time spire/ring light geometry over city plate, weather.
- **Animation method / verification target:** Sequential energy-ring illumination and mechanical rotation, camera approach.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Detailed authored animated tower asset optional; background towers themselves are painted.

### 13. THE GREAT MARKET

- **Exact background/geometry:** `/assets/story/market.webp` — generated-file-verified
- **Consistency/source files:** still_concepts/food/* and newer food board; old Phase1 /assets/culture/concord-market.webp provides material direction.
- **Foreground/depth layers:** Full-screen clean market matte; steam, drone/haulage mesh and food hotspots.
- **Animation method / verification target:** Scroll camera, independent delivery machinery/steam/light.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Static painted crowd/stalls are not fully animated people; detail images are concept-only.

### 14. THE CITY THAT THINKS

- **Exact background/geometry:** `/assets/story/city.webp` — generated-file-verified
- **Consistency/source files:** Same clean city master; /assets/technology/orbital-command.webp supplies restrained cyan interface direction.
- **Foreground/depth layers:** Spatial network lines/markers integrated with architecture and cargo traffic.
- **Animation method / verification target:** Scroll camera and restrained local network pulses/route motion.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** No fake functional SaaS dashboard; painted architecture remains still.

### 15. PLANETARY CLIMATE MAP

- **Exact background/geometry:** No flat planet plate; original R3F/Three.js geometry and shader layers.
- **Consistency/source files:** Original PlanetSystem plus data/world.ts; climate references remain direction only.
- **Foreground/depth layers:** Same interactive original planet and three region selectors.
- **Animation method / verification target:** Planet idle/drag, climate focus and reset with real camera/rotation.
- **Quality status:** Original real-time procedural 3D foundation; final visual quality judged from actual browser capture.
- **Missing/limits:** Numerical climate defaults remain configurable speculative fiction.

### 16. PYRAVAR

- **Exact background/geometry:** `/assets/story/desert.webp` — generated-file-verified
- **Consistency/source files:** still_concepts/architecture/pyravar_city.png; vehicle board desert_skimmer; newer storyboard07 Pyravar thumbnail.
- **Foreground/depth layers:** Clean black-gold desert/solar settlement matte, skimmer mesh and dust layers.
- **Animation method / verification target:** Camera crossing, dust drift/heat-light approximation, independent skimmer.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** No full sand/solar city simulation; matte terrain remains static.

### 17. PYRAVAR SURVIVAL

- **Exact background/geometry:** `/assets/story/desert.webp` — generated-file-verified
- **Consistency/source files:** Same desert master; fashion/pyravar_desert_attire.png; food/solar_fruit.png.
- **Foreground/depth layers:** Water/agriculture/protective-clothing staging in scene; skimmer and inspection details.
- **Animation method / verification target:** Independent skimmer/dust plus optional survivor/food inspect hotspots.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Soft garment detail is a concept study; no finished rigged worker cast supplied.

### 18. CRYONTH

- **Exact background/geometry:** `/assets/story/ice.webp` — generated-file-verified
- **Consistency/source files:** still_concepts/architecture/cryonth_settlement.png; vehicle board ice crawler; storyboard07.
- **Foreground/depth layers:** Clean cyan glacier/geothermal exterior matte, crawler mesh, snow/mist and aurora layers.
- **Animation method / verification target:** Scroll camera, independent crawler, snow/mist/aurora.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Not a full ice landscape mesh; high-detail crawler production asset optional.

### 19. LIFE BENEATH THE ICE

- **Exact background/geometry:** `/assets/story/ice-interior.webp` — generated-file-verified
- **Consistency/source files:** Cryonth settlement/agriculture direction in storyboard07 plus fashion/cryonth_polar_attire.png.
- **Foreground/depth layers:** Clean geothermal habitation/agriculture interior matte with steam and inspect points.
- **Animation method / verification target:** Camera entry, thermal/steam light layers and inspection.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Painted inhabitants/equipment remain still; no hydroponic machinery rigs supplied.

### 20. AERION MERIDIA

- **Exact background/geometry:** `/assets/story/storm.webp` — generated-file-verified
- **Consistency/source files:** still_concepts/architecture/aerion_meridia.png; old storm cockpit reference and storyboard07.
- **Foreground/depth layers:** Clean storm city/green infrastructure matte, independent craft and weather.
- **Animation method / verification target:** Camera travel, aircraft trajectories and restrained lightning/energy effects.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Not fluid weather simulation; no intense strobe.

### 21. THREE REGIONS, ONE FUTURE

- **Exact background/geometry:** `/assets/story/city.webp` — generated-file-verified
- **Consistency/source files:** Same city master; world bible regional resource exchange; vehicle board cargo hauler.
- **Foreground/depth layers:** Cargo meshes and regional resource-route visualization in spatial scene.
- **Animation method / verification target:** Separate freight routes/markers and scroll camera; inspect regional dependencies.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** No interactive economic simulation; narrative exchange data only.

### 22. LEXORIAN CUISINE

- **Exact background/geometry:** `/assets/story/cuisine.webp` — generated-file-verified
- **Consistency/source files:** New food board ChatGPT Image Nov 11, 2026, 09_26_04 AM-5.png; six clean food-detail crops and meal crops.
- **Foreground/depth layers:** Clean dining/preparation environment matte, steam/light layers and six ingredient hotspots.
- **Animation method / verification target:** Scroll camera, steam and real inspector controls.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Food detail crops are 241–256px native; do not enlarge/claim final 4K food masters.

### 23. THE ATELIER OF 3186

- **Exact background/geometry:** `/assets/story/atelier.webp` — generated-file-verified
- **Consistency/source files:** still_concepts/fashion/*; newer costume/prop board -4; wardrobe thumbnails on character boards for direction only.
- **Foreground/depth layers:** Clean workshop/full-body costume matte and six role/climate inspection points.
- **Animation method / verification target:** Camera transitions, workshop scanning light and garment-detail inspection.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Supplied group garment crops are blurry and not complete full-body production designs; no rigged mannequins supplied.

### 24. OBJECTS OF EVERYDAY LIFE

- **Exact background/geometry:** `/assets/story/objects.webp` — generated-file-verified
- **Consistency/source files:** Newer prop board ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png, label-free gear/boot detail crops.
- **Foreground/depth layers:** Clean still-life environment matte, independent scanning light, ten gear/footwear hotspots.
- **Animation method / verification target:** Camera/light plus image inspection; actual model rotation only if a model exists.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** No supplied prop GLBs/multi-angle sets. These are still/detail images, never pretend 360° models.

### 25. THE THREE-REGION COUNCIL

- **Exact background/geometry:** `/assets/story/council.webp` — generated-file-verified
- **Consistency/source files:** still_concepts/architecture/three_region_council.png exterior direction; storyboard07 council thumbnail.
- **Foreground/depth layers:** Clean civic chamber matte, regional civic light/inspection points.
- **Animation method / verification target:** Camera approach and restrained spatial council light.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Painted delegations remain still; no simulated government vote or character animation.

### 26. THE FUTURE GENERATION

- **Exact background/geometry:** `/assets/story/commons.webp` — generated-file-verified
- **Consistency/source files:** Storyboard07 future-generation thumbnail; professional_field_gear costume material direction.
- **Foreground/depth layers:** Clean original education/healthcare/research commons matte, independent service vehicle/effects and inspect points.
- **Animation method / verification target:** Camera movement, localized light/traffic and information inspection.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** The actual generated commons supplies original education/care/science scenery; no character or machinery rigs are supplied.

### 27. THE LIVING ECOSYSTEM

- **Exact background/geometry:** `/assets/story/ecosystem.webp` — generated-file-verified
- **Consistency/source files:** still_concepts/ecosystems/*; newer full asset board ecological thumbnails.
- **Foreground/depth layers:** Clean native habitat matte, procedural atmospheric life/light and ecological hotspots.
- **Animation method / verification target:** Camera movement and environmental particles/independent creature geometry only where actually modeled.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Myr/Aeralis detail crops are soft static concepts; no rigged animals/transparent creature sprites supplied.

Scene27 runtime additionally includes original small procedural mist-skates (`NativeDrifters.tsx`): 5desktop/2mobile, membrane flexion and spatial flight follow scroll. Myr figures and large wildlife remain still imagery; no rigged Myr animation is claimed.

### 28. PREPARING FOR CONVERGENCE

- **Exact background/geometry:** `/assets/story/convergence.webp` — generated-file-verified
- **Consistency/source files:** still_concepts/festivals/night_of_convergence_celebration.png; storyboard07 scene28 only.
- **Foreground/depth layers:** Clean capital preparation matte with independent instanced lantern-like drones, light activation and cargo.
- **Animation method / verification target:** Scroll camera rise, real separate lantern positions and civic illumination.
- **Quality status:** Clean generated cinematic still + independent real-time layers; native resolution 1672×941.
- **Missing/limits:** Preparation only; full Night of Convergence/ceremony begins Phase3. No licensed recorded soundtrack supplied.

## Optimized supplied details and native limits

These files are useful for small, optional inspect overlays. The supplied crop is the displayed object; rotating a DOM/image plane would not make it a real 3D object. Source boards are never shown as finished scenery. No derivative has been upscaled.

| Actual web file | Native size | Kind | Exact source / crop |
| --- | --- | --- | --- |
| `/assets/story/reference-city-center.webp` | 853×480 | temporary-city-plate | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/larger_city_reference_plates/velair_prime_center.png` / `None` |
| `/assets/story/reference-city-train.webp` | 931×524 | temporary-city-plate | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/larger_city_reference_plates/velair_prime_city_and_train.png` / `None` |
| `/assets/story/reference-city-sunset.webp` | 905×509 | temporary-city-plate | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/larger_city_reference_plates/velair_prime_sunset_transit.png` / `None` |
| `/assets/story/reference-city-cloudways.webp` | 888×500 | temporary-city-plate | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/larger_city_reference_plates/velair_prime_cloud_highways.png` / `None` |
| `/assets/story/reference-city-arrival.webp` | 1084×649 | temporary-city-plate | `LEXORYN_Phase2_Props_Locations_and_Motion/environments/velair_prime_existing_city_plate.png` / `[70, 0, 1154, 649]` |
| `/assets/story/details/food-aether-grain.webp` | 256×253 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_04 AM-5.png` / `[22, 180, 278, 433]` |
| `/assets/story/details/food-cryo-bloom.webp` | 245×252 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_04 AM-5.png` / `[306, 180, 551, 432]` |
| `/assets/story/details/food-sky-kelp.webp` | 246×252 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_04 AM-5.png` / `[578, 180, 824, 432]` |
| `/assets/story/details/food-solar-fruit.webp` | 247×252 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_04 AM-5.png` / `[850, 180, 1097, 432]` |
| `/assets/story/details/food-mistwater-broth.webp` | 241×252 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_04 AM-5.png` / `[1126, 180, 1367, 432]` |
| `/assets/story/details/food-lumifungus.webp` | 252×252 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_04 AM-5.png` / `[1398, 180, 1650, 432]` |
| `/assets/story/details/food-ceremonial-platter.webp` | 823×335 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_04 AM-5.png` / `[26, 522, 849, 857]` |
| `/assets/story/details/food-market-meal.webp` | 756×335 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_04 AM-5.png` / `[889, 522, 1645, 857]` |
| `/assets/story/details/gear-translation-pendant.webp` | 344×165 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[24, 220, 368, 385]` |
| `/assets/story/details/gear-signal-ring.webp` | 344×161 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[24, 439, 368, 600]` |
| `/assets/story/details/gear-climate-earrings.webp` | 344×197 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[24, 663, 368, 860]` |
| `/assets/story/details/gear-ceremonial-crown.webp` | 414×165 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[406, 220, 820, 385]` |
| `/assets/story/details/gear-environmental-visor.webp` | 414×161 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[406, 439, 820, 600]` |
| `/assets/story/details/gear-comms-brooch.webp` | 414×197 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[406, 663, 820, 860]` |
| `/assets/story/details/gear-neural-bracelet.webp` | 379×165 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[1271, 220, 1650, 385]` |
| `/assets/story/details/gear-scanner-cuff.webp` | 379×161 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[1271, 439, 1650, 600]` |
| `/assets/story/details/gear-medical-sensor.webp` | 379×197 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[1271, 663, 1650, 860]` |
| `/assets/story/details/footwear-sky-grip.webp` | 386×165 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[850, 220, 1236, 385]` |
| `/assets/story/details/footwear-heat-walker.webp` | 386×161 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[850, 439, 1236, 600]` |
| `/assets/story/details/footwear-ice-grip.webp` | 386×197 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/ChatGPT Image Nov 11, 2026, 09_26_02 AM-4.png` / `[850, 663, 1236, 860]` |
| `/assets/story/details/fashion-pyravar.webp` | 700×350 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/fashion/pyravar_desert_attire.png` / `[10, 0, 710, 350]` |
| `/assets/story/details/fashion-cryonth.webp` | 700×350 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/fashion/cryonth_polar_attire.png` / `[10, 0, 710, 350]` |
| `/assets/story/details/fashion-aerion.webp` | 700×350 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/fashion/aerion_storm_attire.png` / `[10, 0, 710, 350]` |
| `/assets/story/details/fashion-ceremonial.webp` | 700×350 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/fashion/convergence_ceremonial_attire.png` / `[10, 0, 710, 350]` |
| `/assets/story/details/fashion-professional.webp` | 700×350 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/fashion/professional_field_gear.png` / `[10, 0, 710, 350]` |
| `/assets/story/details/eco-myr.webp` | 470×540 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/ecosystems/myr_luminous_stag.png` / `[90, 15, 560, 555]` |
| `/assets/story/details/eco-aeralis.webp` | 470×540 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/ecosystems/aeralis_sky_glider.png` / `[90, 15, 560, 555]` |
| `/assets/story/details/eco-avian.webp` | 470×540 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/ecosystems/avian_glider.png` / `[90, 15, 560, 555]` |
| `/assets/story/details/eco-root-grass.webp` | 470×540 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/ecosystems/native_root_grass.png` / `[90, 15, 560, 555]` |
| `/assets/story/details/eco-fungus.webp` | 470×540 | concept-detail | `LEXORYN_Phase2_Props_Locations_and_Motion/still_concepts/ecosystems/bioluminescent_fungus.png` / `[90, 15, 560, 555]` |

## Provenance and distribution

User-approved source references remain supplied material. The source packs record no blanket public redistribution grant; no rights claim is inferred from visual appearance or generated-looking content. Preserve the existing private workflow and the earlier public-GitHub restriction: supplied raw images, cropped derivatives and previews are not permitted in the public GitHub push. Public source/docs may describe them without embedding their binaries or asserting redistribution rights. Clean newly generated plates are separately documented; do not use generation provenance as a blanket license for supplied references. Generated files are described as generated only after actual tool output/file verification, with exact prompts recorded separately. All raw inputs stay unchanged; optimized copies are separate. No credentials or private source service tokens belong in this manifest.

## Remaining production refinements

The initial 28-scene implementation can use actual generated clean plates plus the shared mesh/atmosphere engine. Production upgrades remain optional: 4K or larger coherent scene masters, registered authored planetary texture maps, high-detail vehicle/prop GLBs, rigged native creatures and crowds, separated architectural foregrounds and licensed recorded ambience. These do not become “supplied” merely because a board prints a proposed filename or 4K label. Final browser validation must distinguish static baked people/ships from independently changing object positions, test reverse scroll and pause, preserve real planet drag/climate/reset, and verify mobile/reduced-motion behavior.
