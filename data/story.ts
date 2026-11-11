/** Phase 1–2 story canon. Asset paths are replaceable production slots, not claims of resolution. */
export type StoryVector = readonly [number, number, number];
export type StoryPalette = 'orbit' | 'city' | 'market' | 'desert' | 'ice' | 'storm' | 'culture' | 'festival';
export type StoryVehicle = 'fleet' | 'scout' | 'train' | 'bike' | 'cargo' | 'skimmer' | 'crawler' | 'none';
export type StoryEffect = 'cloud' | 'dust' | 'snow' | 'storm' | 'steam' | 'aurora' | 'lantern' | 'none';
export interface CameraKeyframe {
  readonly at: number;
  readonly position: StoryVector;
  readonly target: StoryVector;
}
export interface StoryHotspot {
  readonly id: string;
  readonly title: string;
  readonly position: readonly [number, number];
  readonly body: string;
  readonly detailAsset?: string;
  readonly detailQuality?: 'concept-reference' | 'photographic-detail';
  readonly category?: string;
}
export interface StoryDepthLayer {
  readonly id: string;
  readonly depth: number;
  readonly opacity: number;
  readonly motion: 'scroll' | 'ambient' | 'fixed';
}
export interface StoryMovingObject {
  readonly id: string;
  readonly kind: StoryVehicle;
  readonly from: StoryVector;
  readonly to: StoryVector;
  readonly scale: number;
}
export interface StoryScene {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly chapter: 1 | 2 | 3 | 4;
  readonly chapterTitle: string;
  readonly mode: 'orbit' | 'world';
  readonly asset: string;
  readonly mobileAsset?: string;
  readonly palette: StoryPalette;
  readonly vehicle: StoryVehicle;
  readonly effect: StoryEffect;
  readonly caption: string;
  /** Relative scroll weight: the 28 beats occupy about 23 viewport units. */
  readonly duration: number;
  readonly camera: readonly CameraKeyframe[];
  readonly hotspots: readonly StoryHotspot[];
  readonly foregroundAssets: readonly string[];
  readonly depthLayers: readonly StoryDepthLayer[];
  readonly movingObjects: readonly StoryMovingObject[];
  readonly lighting: { readonly key: string; readonly fill: string; readonly ambient: number; readonly exposure: number };
  readonly info: string;
  readonly quality: 'procedural' | 'layered-plate' | 'concept-reference';
}
export const storyChapters = [
  { id: 1, title: 'THE UNCHARTED SYSTEM', startScene: 1, endScene: 7 },
  { id: 2, title: 'CITY OF A MILLION VOICES', startScene: 8, endScene: 14 },
  { id: 3, title: 'THREE CLIMATES, ONE CIVILIZATION', startScene: 15, endScene: 21 },
  { id: 4, title: 'THE LIVES WE BUILT', startScene: 22, endScene: 28 },
] as const;

const detail = (name: string) => `/assets/story/details/${name}.webp`;
const hotspot = (id: string, title: string, position: readonly [number, number], body: string, category: string, filename?: string): StoryHotspot => ({
  id, title, position, body, category,
  ...(filename ? { detailAsset: detail(filename), detailQuality: 'concept-reference' as const } : {}),
});
const key = (at: number, position: StoryVector, target: StoryVector): CameraKeyframe => ({ at, position, target });
const flight = (start: StoryVector, end: StoryVector, targetStart: StoryVector = [0, 0, -8], targetEnd: StoryVector = [0, 0, -8], arc = 0): readonly CameraKeyframe[] => [
  key(0, start, targetStart),
  key(.52, [(start[0] + end[0]) / 2 + arc, (start[1] + end[1]) / 2 + Math.abs(arc) * .14, (start[2] + end[2]) / 2], [(targetStart[0] + targetEnd[0]) / 2, (targetStart[1] + targetEnd[1]) / 2, (targetStart[2] + targetEnd[2]) / 2]),
  key(1, end, targetEnd),
];
const surfaceFlight = (x = .6, y = .4, z = 8.2, arc = .2) => flight([-.25, .15, 12], [x, y, z], [0, 0, -8], [x * .18, y * .18, -8], arc);
const lighting: Readonly<Record<StoryPalette, StoryScene['lighting']>> = {
  orbit: { key: '#ffe0af', fill: '#4b6d93', ambient: .06, exposure: 1.02 },
  city: { key: '#f7d9ab', fill: '#59dbe7', ambient: .18, exposure: 1.05 },
  market: { key: '#edbe7a', fill: '#74a8a8', ambient: .25, exposure: .96 },
  desert: { key: '#ffc17d', fill: '#6e6561', ambient: .14, exposure: 1.12 },
  ice: { key: '#cbeafa', fill: '#3c668e', ambient: .2, exposure: 1.03 },
  storm: { key: '#b5d8e4', fill: '#596482', ambient: .12, exposure: .94 },
  culture: { key: '#ead2ae', fill: '#658a99', ambient: .24, exposure: 1.01 },
  festival: { key: '#f2ba6f', fill: '#507082', ambient: .16, exposure: .97 },
};
const routes = (vehicle: StoryVehicle): readonly StoryMovingObject[] => vehicle === 'none' ? [] : vehicle === 'fleet' ? [
  { id: 'foreground-observer', kind: 'scout', from: [-9, -.5, 4], to: [10, .6, 1], scale: .9 },
  { id: 'station-shadow-shuttle', kind: 'cargo', from: [6, 1.1, -5], to: [-8, .5, -3], scale: .32 },
  { id: 'surface-bound-vessel', kind: 'scout', from: [-1, 3, -1], to: [2, -1.2, -10], scale: .25 },
] : [
  { id: 'foreground-route', kind: vehicle, from: [-9, -.25, 2], to: [10, .25, -1], scale: vehicle === 'train' ? .7 : .6 },
  { id: 'return-route', kind: vehicle === 'train' ? 'cargo' : vehicle, from: [8, 1.1, -6], to: [-8, .7, -4], scale: .22 },
];
interface SceneInput {
  id: number; title: string; mode?: 'orbit' | 'world'; asset?: string; palette?: StoryPalette;
  vehicle?: StoryVehicle; effect?: StoryEffect; caption: string; duration?: number;
  camera?: readonly CameraKeyframe[]; hotspots?: readonly StoryHotspot[]; info?: string;
}
function scene(input: SceneInput): StoryScene {
  const chapter = (Math.floor((input.id - 1) / 7) + 1) as StoryScene['chapter'];
  const mode = input.mode ?? 'world';
  const palette = input.palette ?? (mode === 'orbit' ? 'orbit' : 'city');
  const vehicle = input.vehicle ?? 'none';
  const effect = input.effect ?? 'none';
  return {
    id: input.id, slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''),
    title: input.title, chapter, chapterTitle: storyChapters[chapter - 1].title, mode,
    asset: input.asset ?? '', mobileAsset: input.asset, palette, vehicle, effect,
    caption: input.caption, duration: input.duration ?? .8,
    camera: input.camera ?? surfaceFlight(), hotspots: input.hotspots ?? [], foregroundAssets: [],
    depthLayers: mode === 'orbit' ? [
      { id: 'moon-and-debris', depth: -4, opacity: 1, motion: 'scroll' },
      { id: 'planet-surface', depth: 0, opacity: 1, motion: 'ambient' },
      { id: 'orbital-lane', depth: 3, opacity: 1, motion: 'scroll' },
    ] : [
      { id: 'environment-plate', depth: -16, opacity: 1, motion: 'fixed' },
      { id: 'midground-atmosphere', depth: -7, opacity: .38, motion: 'ambient' },
      { id: 'near-atmosphere', depth: -1, opacity: .25, motion: 'scroll' },
      { id: 'foreground-structure', depth: 3, opacity: 1, motion: 'scroll' },
    ],
    movingObjects: routes(vehicle), lighting: lighting[palette],
    info: input.info ?? (mode === 'orbit' ? 'Original procedural 3D planet and orbital geometry.' : 'Cinematic environment plate with independent real-time foreground and atmospheric layers.'),
    quality: mode === 'orbit' && input.id < 6 || input.id === 15 ? 'procedural' : 'layered-plate',
  };
}

const climateHotspots = [
  hotspot('pyravar', 'PYRAVAR', [.25, .66], 'Solar harvesters supply power; shielded reservoirs and heat-fiber clothing protect desert settlements.', 'region'),
  hotspot('cryonth', 'CRYONTH', [.47, .25], 'Geothermal refuges sustain polar research, insulated transport and enclosed biological agriculture.', 'region'),
  hotspot('aerion', 'AERION MERIDIA', [.72, .56], 'Storm stabilizers shelter the largest population, mist-fed farms and the capital’s aerial transport network.', 'region'),
] as const;
export const cuisineHotspots: readonly StoryHotspot[] = [
  hotspot('aether-grain', 'AETHER GRAIN', [.2, .49], 'A resilient staple steamed in sealed bronze vessels; shared bowls mark the beginning of a Concord meal.', 'food', 'food-aether-grain'),
  hotspot('cryo-bloom', 'CRYO BLOOM', [.43, .34], 'Cold-adapted tubers grow in geothermal nutrient beds and retain warmth when roasted inside insulated serving shells.', 'food', 'food-cryo-bloom'),
  hotspot('sky-kelp', 'SKY KELP', [.68, .42], 'Mist-grown ribbons supply minerals and protein; Aerion cooks blanch them in recovered atmospheric water.', 'food', 'food-sky-kelp'),
  hotspot('solar-fruit', 'SOLAR FRUIT', [.82, .63], 'Pyravar’s shaded mineral orchards produce heat-tolerant fruit, served in thin slices after water-intensive travel.', 'food', 'food-solar-fruit'),
  hotspot('mistwater-broth', 'MISTWATER BROTH', [.52, .7], 'Aromatic broth uses condensed storm moisture; induction-heated bowls keep it hot without an exposed cooking flame.', 'food', 'food-mistwater-broth'),
  hotspot('lumifungus', 'LUMIFUNGUS', [.29, .76], 'Cultivated fungal protein grows in recycled substrate; fermentation develops flavor and returns nutrients to the growing loop.', 'food', 'food-lumifungus'),
];
export const attireHotspots: readonly StoryHotspot[] = [
  hotspot('pyravar-attire', 'PYRAVAR / HEAT FIBER', [.17, .5], 'Reflective drapes, sealed visors and heat-walker soles reduce radiant exposure while allowing the wearer to move through dust.', 'costume', 'fashion-pyravar'),
  hotspot('cryonth-attire', 'CRYONTH / THERMAL LAYERS', [.36, .48], 'Insulated collars, gloves and ice-grip boots keep skin protected; small bio-light markers help teams stay visible in polar darkness.', 'costume', 'fashion-cryonth'),
  hotspot('aerion-attire', 'AERION / STORM SHELL', [.57, .5], 'Flexible dark smart fabric sheds rain; bronze seams carry identification and storm-rated footwear grips exposed transit platforms.', 'costume', 'fashion-aerion'),
  hotspot('field-professionals', 'SCIENCE / FIELD GEAR', [.76, .43], 'Layered utility coats carry scanners, samples and medical sensors; removable gloves preserve dexterity without ignoring the local climate.', 'costume', 'fashion-professional'),
  hotspot('defense-armor', 'DEFENSE / ARTICULATED ARMOR', [.84, .69], 'Segmented titanium protects vital areas while flexible joints support evacuation, maintenance and work aboard aerial craft.', 'costume', 'fashion-professional'),
  hotspot('convergence-attire', 'CONVERGENCE / CEREMONIAL', [.47, .77], 'Formal bronze-thread garments retain regional protective layers; their luminous patterns identify the wearer’s home climate during shared ceremonies.', 'costume', 'fashion-ceremonial'),
];
export const everydayHotspots: readonly StoryHotspot[] = [
  hotspot('neural-bracelet', 'NEURAL BRACELET', [.18, .32], 'A voluntary wearable relays personal interface gestures and emergency signals; it does not replace the wearer’s judgment.', 'object', 'gear-neural-bracelet'),
  hotspot('climate-visor', 'CLIMATE VISOR', [.41, .28], 'Optical filtration protects eyes from glare and charged dust while presenting a minimal local-weather warning.', 'object', 'gear-environmental-visor'),
  hotspot('translation-pendant', 'TRANSLATION PENDANT', [.69, .3], 'A compact interpreter bridges regional speech and trade glyphs while retaining a physical push-to-speak control.', 'object', 'gear-translation-pendant'),
  hotspot('ceremonial-crown', 'CEREMONIAL CROWN', [.84, .45], 'A public ceremonial identifier displays a representative’s regional affiliation; its lighting uses the same restrained civic technology as the capital.', 'object', 'gear-ceremonial-crown'),
  hotspot('environmental-scanner', 'ENVIRONMENTAL SCANNER', [.17, .58], 'A wrist scanner samples temperature, air chemistry and local radiation before a team leaves a protected habitat.', 'object', 'gear-scanner-cuff'),
  hotspot('communication-jewelry', 'COMMUNICATION BROOCH', [.4, .53], 'A clothing-mounted relay carries short-range messages and location beacons without occupying the wearer’s hands.', 'object', 'gear-comms-brooch'),
  hotspot('medical-sensor', 'MEDICAL SENSOR', [.65, .53], 'A small skin-contact instrument flags heat or cold stress and supports a clinician’s assessment.', 'object', 'gear-medical-sensor'),
  hotspot('heat-walkers', 'HEAT-WALKER BOOTS', [.22, .8], 'Layered insulated soles and dust seals protect desert travelers from hot mineral surfaces.', 'footwear', 'footwear-heat-walker'),
  hotspot('ice-grip-boots', 'ICE-GRIP BOOTS', [.49, .79], 'Thermal liners and retractable traction elements support secure movement around Cryonth’s ice and geothermal equipment.', 'footwear', 'footwear-ice-grip'),
  hotspot('sky-grip-footwear', 'SKY-GRIP FOOTWEAR', [.77, .8], 'Wind-rated tread and platform docking contacts help Aerion workers cross wet, elevated walkways.', 'footwear', 'footwear-sky-grip'),
];

export const storyScenes: readonly StoryScene[] = [
  scene({ id: 1, title: 'THE UNCHARTED SYSTEM', mode: 'orbit', caption: 'The planet where intelligence became civilization.', duration: 1.1, camera: flight([0, .35, 10.5], [.2, .3, 9], [.75, .1, 0], [.65, .1, 0]) }),
  scene({ id: 2, title: 'THE BROKEN MOON', mode: 'orbit', caption: 'A fractured companion. A history still in orbit.', duration: .7, camera: flight([.2, .3, 9], [-1.3, .7, 8.3], [.65, .1, 0], [.5, .2, 0], -.35) }),
  scene({ id: 3, title: 'GOLDEN MERIDIANS', mode: 'orbit', caption: 'Ancient engineering follows the seams of a living world.', duration: .7, camera: flight([-1.3, .7, 8.3], [.6, .35, 6.2], [.5, .2, 0], [1, .1, 0], .15), hotspots: [hotspot('surface-vein', 'SURFACE MERIDIANS', [.7, .61], 'Engineered conduits connect climate infrastructure across the crust. The Codex Vein coordinates their energy and environmental exchange.', 'technology')] }),
  scene({ id: 4, title: 'FIRST TRANSMISSION', mode: 'orbit', caption: 'A signal rises through the silence.', duration: .65, camera: flight([.6, .35, 6.2], [.9, .25, 5.6], [1, .1, 0], [1.15, .1, 0]), hotspots: [hotspot('gpt-signal', 'GENERATIVE PLANETARY THREAD', [.72, .42], 'G.P.T. interprets planetary conditions and communicates them to the Concord. This is a fictional intelligence within the story.', 'signal')] }),
  scene({ id: 5, title: 'THE OBSERVATION FLEET', mode: 'orbit', vehicle: 'fleet', caption: 'Three paths. One new horizon.', duration: .9, camera: flight([.9, .25, 5.6], [1.1, .2, 4.1], [1.15, .1, 0], [1.25, .05, -.2]) }),
  scene({ id: 6, title: 'ATMOSPHERIC ENTRY', mode: 'orbit', asset: '/assets/story/clouds.webp', effect: 'cloud', caption: 'The boundary between silence and weather.', duration: .95, camera: flight([1.1, .2, 4.1], [1.25, .3, .8], [1.25, .05, -.2], [1.25, .15, -5]) }),
  scene({ id: 7, title: 'THROUGH THE STORMS', mode: 'orbit', asset: '/assets/story/clouds.webp', palette: 'storm', effect: 'storm', vehicle: 'scout', caption: 'Follow the light. The city is waiting.', duration: .9, camera: flight([1.25, .3, .8], [.5, .35, -5.8], [1.25, .15, -5], [0, .1, -16], -.2) }),
  scene({ id: 8, title: 'FIRST SIGHT OF VELAIR PRIME', asset: '/assets/story/city.webp', palette: 'city', vehicle: 'fleet', effect: 'cloud', caption: 'VELAIR PRIME / CAPITAL OF LEXORYN', duration: 1.05, camera: surfaceFlight(.3, .45, 9.4, -.2) }),
  scene({ id: 9, title: 'THE SKYWAY', asset: '/assets/story/city.webp', palette: 'city', vehicle: 'scout', effect: 'cloud', caption: 'Every route carries a thousand ordinary lives.', duration: .85, camera: surfaceFlight(1.15, .18, 7.6, .5) }),
  scene({ id: 10, title: 'THE TRANSIT RINGS', asset: '/assets/story/city.webp', palette: 'city', vehicle: 'train', caption: 'The city moves as one connected organism.', duration: .85, camera: surfaceFlight(-1.1, .65, 8.4, -.4), hotspots: [hotspot('ring-interchange', 'RING INTERCHANGE', [.63, .58], 'Aerial trains dock at protected transfer rings; scheduled routes keep passenger and cargo traffic separated from open skyways.', 'transport')] }),
  scene({ id: 11, title: 'LIFE ABOVE THE CLOUDS', asset: '/assets/story/city.webp', palette: 'city', vehicle: 'bike', effect: 'cloud', caption: 'A balcony, a garden, a place to belong.', duration: .8, camera: surfaceFlight(.8, -.3, 8.6, .7), hotspots: [hotspot('sky-gardens', 'MIST GARDENS', [.72, .43], 'Sheltered terraces collect mist and grow useful plants close to homes; windbreaks protect residents and pollinators.', 'habitat')] }),
  scene({ id: 12, title: 'THE ENERGY SPIRES', asset: '/assets/story/city.webp', palette: 'storm', effect: 'storm', caption: 'Weather is powerful. Balance is deliberate.', duration: .85, camera: surfaceFlight(-.6, 1.1, 7.8, -.6), hotspots: [hotspot('stabilizer-spire', 'ATMOSPHERIC STABILIZER', [.62, .4], 'Distributed towers measure charge, exchange energy and moderate inhabited wind corridors. They complement shelters rather than eliminating every storm.', 'technology')] }),
  scene({ id: 13, title: 'THE GREAT MARKET', asset: '/assets/story/market.webp', palette: 'market', vehicle: 'cargo', effect: 'steam', caption: 'A million voices meet beneath bronze light.', duration: 1, camera: surfaceFlight(.55, .12, 8, .35), hotspots: [cuisineHotspots[0], cuisineHotspots[2], hotspot('trade-glyphs', 'TRADE GLYPHS', [.75, .29], 'Regional traders pair physical labels with translation devices; shared symbols identify ingredients, repair services and safe transport routes.', 'culture')] }),
  scene({ id: 14, title: 'THE CITY THAT THINKS', asset: '/assets/story/city.webp', palette: 'city', vehicle: 'cargo', effect: 'cloud', caption: 'Intelligence becomes infrastructure. Responsibility remains with people.', duration: .8, camera: surfaceFlight(-.8, .5, 9, -.2), hotspots: [hotspot('civic-network', 'CIVIC THREAD', [.6, .45], 'Transport schedules, weather observations and energy exchange share a common civic network interpreted through G.P.T.', 'technology')] }),
  scene({ id: 15, title: 'PLANETARY CLIMATE MAP', mode: 'orbit', caption: 'Three climates. Three ways to survive.', duration: 1, camera: flight([0, .35, 10], [.5, .45, 8.2], [.65, .1, 0], [.8, .1, 0], -.3), hotspots: climateHotspots }),
  scene({ id: 16, title: 'PYRAVAR', asset: '/assets/story/desert.webp', palette: 'desert', vehicle: 'skimmer', effect: 'dust', caption: 'Where sunlight becomes the civilization’s power.', duration: .9, camera: surfaceFlight(1.25, .16, 8, .6), hotspots: [hotspot('solar-fields', 'SOLAR HARVEST FIELDS', [.7, .4], 'Reflective collectors supply regional power while shaded maintenance routes keep workers away from the highest radiant exposure.', 'infrastructure')] }),
  scene({ id: 17, title: 'PYRAVAR SURVIVAL', asset: '/assets/story/desert.webp', palette: 'desert', vehicle: 'skimmer', effect: 'dust', caption: 'Every shelter protects water, energy and human life.', duration: .8, camera: surfaceFlight(-.85, -.16, 7.8, -.35), hotspots: [hotspot('reservoir-loop', 'CLOSED WATER LOOP', [.3, .57], 'Reservoirs, filtered graywater and enclosed growing chambers conserve water; protected clothing reduces the thermal load carried by travelers.', 'survival'), attireHotspots[0], cuisineHotspots[3]] }),
  scene({ id: 18, title: 'CRYONTH', asset: '/assets/story/ice.webp', palette: 'ice', vehicle: 'crawler', effect: 'aurora', caption: 'Beneath the polar night, another kind of warmth.', duration: .9, camera: surfaceFlight(-.9, .7, 8.5, -.4), hotspots: [hotspot('geothermal-refuge', 'GEOTHERMAL REFUGE', [.65, .6], 'Compact insulated settlements cluster around controlled geothermal exchange; exterior corridors remain exposed to severe cold.', 'infrastructure')] }),
  scene({ id: 19, title: 'LIFE BENEATH THE ICE', asset: '/assets/story/ice-interior.webp', palette: 'ice', effect: 'steam', caption: 'Warmth is shared. Nothing useful is wasted.', duration: .85, camera: surfaceFlight(.7, .18, 8, .3), hotspots: [hotspot('algae-chambers', 'ALGAE CHAMBERS', [.25, .46], 'Sealed nutrient loops grow algae beside thermal exchangers, returning water and useful biomass to the settlement.', 'agriculture'), hotspot('thermal-exchange', 'THERMAL EXCHANGE', [.76, .38], 'Heat exchangers separate geothermal equipment from living air; insulated service suits protect the workers who maintain them.', 'technology'), attireHotspots[1], cuisineHotspots[1]] }),
  scene({ id: 20, title: 'AERION MERIDIA', asset: '/assets/story/storm.webp', palette: 'storm', vehicle: 'fleet', effect: 'storm', caption: 'A civilization shaped by wind, water and electrical skies.', duration: .9, camera: surfaceFlight(1, .6, 7.9, .45), hotspots: [hotspot('storm-corridor', 'PROTECTED WIND CORRIDOR', [.63, .39], 'Stabilizers, shelters and scheduled aircraft lanes work together; green terraces capture moisture where the structure can withstand the wind.', 'infrastructure'), attireHotspots[2]] }),
  scene({ id: 21, title: 'THREE REGIONS, ONE FUTURE', asset: '/assets/story/city.webp', palette: 'city', vehicle: 'cargo', effect: 'cloud', caption: 'Food, water, energy and knowledge travel together.', duration: .85, camera: surfaceFlight(-.5, .6, 9.7, -.25), hotspots: [
    hotspot('pyravar', 'PYRAVAR / ENERGY', [.24, .52], 'Desert solar infrastructure supplies energy while receiving water-efficient crops, specialist equipment and regional knowledge.', 'region'),
    hotspot('cryonth', 'CRYONTH / RESEARCH', [.5, .35], 'Polar laboratories and geothermal habitats contribute cold-environment research, biological cultures and resilient thermal technology.', 'region'),
    hotspot('aerion', 'AERION / FOOD AND TRANSIT', [.76, .57], 'Temperate farms and the capital’s transit network distribute food, coordinate freight and connect the Concord’s regional communities.', 'region'),
  ] }),
  scene({ id: 22, title: 'LEXORIAN CUISINE', asset: '/assets/story/cuisine.webp', palette: 'market', effect: 'steam', caption: 'The world is understood, one shared meal at a time.', duration: 1, camera: surfaceFlight(.45, -.25, 8.8, .2), hotspots: cuisineHotspots }),
  scene({ id: 23, title: 'THE ATELIER OF 3186', asset: '/assets/story/atelier.webp', palette: 'culture', effect: 'steam', caption: 'Every fabric remembers the climate it was made for.', duration: .95, camera: surfaceFlight(-.6, .25, 9.2, -.35), hotspots: attireHotspots }),
  scene({ id: 24, title: 'OBJECTS OF EVERYDAY LIFE', asset: '/assets/story/objects.webp', palette: 'culture', caption: 'Small objects. A thousand practical acts of care.', duration: .95, camera: surfaceFlight(.45, -.2, 9.6, .25), hotspots: everydayHotspots, info: 'Layered still-life artwork with a separate real-time scanning light. Concept-detail images are identified as still references, not rotatable 3D models.' }),
  scene({ id: 25, title: 'THE THREE-REGION COUNCIL', asset: '/assets/story/council.webp', palette: 'culture', caption: 'No region can govern a shared atmosphere alone.', duration: .85, camera: surfaceFlight(0, .65, 9.4, .1), hotspots: [
    hotspot('council-pyravar', 'PYRAVAR DELEGATION', [.23, .59], 'Desert delegates bring solar-production and water-budget evidence before decisions that affect the wider planetary network.', 'government'),
    hotspot('council-cryonth', 'CRYONTH DELEGATION', [.51, .4], 'Polar delegates contribute thermal-system and research assessments; safety margins are reviewed across regions rather than in isolation.', 'government'),
    hotspot('council-aerion', 'AERION DELEGATION', [.77, .59], 'Temperate delegates present food, population and transit needs; shared infrastructure decisions require cross-regional environmental review.', 'government'),
  ] }),
  scene({ id: 26, title: 'THE FUTURE GENERATION', asset: '/assets/story/commons.webp', palette: 'culture', vehicle: 'cargo', caption: 'A future is built by people who can care for it.', duration: .85, camera: surfaceFlight(.7, .15, 8.8, .3), hotspots: [
    hotspot('learning-commons', 'LEARNING COMMONS', [.24, .42], 'Students study real climate observations alongside craft, language and civic history, learning how their decisions affect other regions.', 'education'),
    hotspot('community-care', 'COMMUNITY CARE', [.56, .68], 'Clinicians combine direct care with unobtrusive environmental sensors; technology supports attention to patients rather than replacing it.', 'healthcare'),
    hotspot('field-laboratories', 'FIELD LABORATORIES', [.76, .36], 'Researchers share tools and controlled biological cultures; young apprentices learn to maintain the systems their communities rely upon.', 'science'),
  ] }),
  scene({ id: 27, title: 'THE LIVING ECOSYSTEM', asset: '/assets/story/ecosystem.webp', palette: 'city', effect: 'cloud', caption: 'The native world is a neighbor, not a resource alone.', duration: .95, camera: surfaceFlight(-.8, .26, 8.9, -.4), hotspots: [
    hotspot('myr', 'MYR / LUMINOUS HERD', [.28, .57], 'Native Myr follow sheltered seasonal routes. Settlements leave migration corridors open and use low-intensity lighting near their habitat.', 'ecology', 'eco-myr'),
    hotspot('aeralis', 'AERALIS / SKY GLIDER', [.7, .27], 'Broad-winged gliders use rising air above the valleys; marked aircraft lanes keep routine traffic outside their breeding corridors.', 'ecology', 'eco-aeralis'),
    hotspot('root-grass', 'ROOT GRASS', [.61, .79], 'Dense native root systems hold wet valley soil; protected strips reduce erosion around farms and infrastructure.', 'ecology', 'eco-root-grass'),
    hotspot('native-fungus', 'LUMINOUS FUNGI', [.17, .76], 'Native fungi recycle organic material in shaded ground layers. Cultivated food species are kept distinct from unmanaged wild growth.', 'ecology', 'eco-fungus'),
  ] }),
  scene({ id: 28, title: 'PREPARING FOR CONVERGENCE', asset: '/assets/story/convergence.webp', palette: 'festival', effect: 'lantern', vehicle: 'cargo', caption: 'Tonight, three regions will light one sky.', duration: 1.15, camera: surfaceFlight(.2, 1.15, 10.1, -.2), hotspots: [hotspot('convergence-drones', 'CONVERGENCE LIGHTS', [.7, .4], 'Coordinated lantern drones rise from civic terraces, tracing the shared regional energy network as communities prepare for the Night of Convergence.', 'festival')], info: 'Festival preparation concludes this phase. The Night of Convergence ceremony begins the next chapter; no crisis branch is implemented here.' }),
];
