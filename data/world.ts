/** Fictional, editable PROJECT GENESIS canon. No value is an observation of a real planet. */
export type RegionId = 'pyravar' | 'cryonth' | 'aerion';
export type Phase = 1 | 2 | 3 | 4;
export type Vector3Tuple = readonly [number, number, number];
export interface Region {
  readonly id: RegionId;
  readonly name: string;
  readonly shortName: string;
  readonly subtitle: string;
  readonly climate: string;
  readonly temperature: string;
  readonly terrain: string;
  readonly infrastructure: readonly string[];
  readonly agriculture: string;
  readonly transport: string;
  readonly costume: string;
  readonly color: string;
  readonly position: Vector3Tuple;
  readonly latitude: number;
  readonly longitude: number;
}
export interface Chapter {
  readonly id: 'contact' | 'approach' | 'entry' | 'reveal' | 'arrival';
  readonly number: string;
  readonly title: string;
  readonly caption: string;
  readonly start: number;
  readonly end: number;
  readonly camera: Vector3Tuple;
  readonly target: Vector3Tuple;
}
export const world = {
  name: 'LEXORYN',
  title: 'THE LIVING INTELLIGENCE PLANET',
  tagline: 'The planet where intelligence became civilization.',
  year: 3186,
  system: 'UNCHARTED SYSTEM',
  civilization: 'THE LEXORIAN CONCORD',
  capital: 'VELAIR PRIME',
  capitalRegion: 'aerion' as RegionId,
  ancientNetwork: { name: 'THE CODEX VEIN', purpose: 'Coordinates climate stabilizers, energy networks and engineered ecosystems beneath the crust.' },
  conversationalIntelligence: { name: 'G.P.T.', expanded: 'Generative Planetary Thread', purpose: 'Interprets planetary conditions, predicts disasters and supports survival decisions.' },
  attribution: 'Codex Vein and G.P.T. are fictional tributes, not literal product branding or official endorsements.',
  // Tunable world-building assumptions. Organizers’ mystery-card values override these defaults.
  physical: {
    gravityEarthRatio: 0.92,
    dayLengthHours: 32,
    yearLengthEarthDays: 486,
    axialTiltDegrees: 24,
    oceanCoveragePercent: 58,
    atmosphericDescription: 'Dense breathable lower atmosphere with ionized storm corridors; speculative engineered regulation.',
    moonDescription: 'One fractured rocky moon, with a localized debris arc. Orbital geometry is cinematic, not an n-body simulation.',
    scientificBasis: 'Latitude-dependent insolation, polar ice and geothermal refuges, rain-shadow deserts and wind-driven midlatitude storms provide a coherent speculative foundation. Exact values are fictional and configurable.'
  },
  phases: [
    { phase: 1 as Phase, name: 'Discovery', scope: 'Original planet, region profiles, orbital approach, atmosphere, initial capital arrival.' },
    { phase: 2 as Phase, name: 'Civilization', scope: 'City exploration, regions, inhabitants, food, farming, culture, language, government, clothing and transport.' },
    { phase: 3 as Phase, name: 'Intelligence', scope: 'Consistent characters, relationships, Codex Vein, G.P.T. and planetary mystery.' },
    { phase: 4 as Phase, name: 'Survival', scope: 'Branching crisis, environmental change, four-panel comic, endings and final polish.' }
  ]
} as const;
export const regions: readonly Region[] = [
  { id: 'pyravar', name: 'PYRAVAR', shortName: 'Pyravar', subtitle: 'THE SOLAR FRONTIER', climate: 'Hyper-arid / extreme solar exposure', temperature: '38–67°C · daytime surface corridor', terrain: 'Obsidian escarpments and black-gold desert basins', infrastructure: ['Solar harvest towers', 'Subsurface water reservoirs', 'Shielded low-profile settlements'], agriculture: 'Subsurface hydroponics fed by reclaimed water; shaded mineral-fruit terraces.', transport: 'Heat-shielded skimmers and buried freight corridors.', costume: 'Reflective layered heat-fiber robes, sealed visors and insulated soles.', color: '#F4C37A', position: [1.18,-0.64,1.48], latitude: -18, longitude: 32 },
  { id: 'cryonth', name: 'CRYONTH', shortName: 'Cryonth', subtitle: 'THE FROZEN INTELLIGENCE FRONTIER', climate: 'Polar / geothermal refuges', temperature: '−64 to −18°C · exterior settlement range', terrain: 'Cyan glacier shelves, basalt fissures and deep ice caverns', infrastructure: ['Geothermal research cities', 'Insulated transit links', 'Controlled biological agriculture'], agriculture: 'Thermally isolated growing chambers and geothermal nutrient loops.', transport: 'Insulated crawlers and sheltered ice-rail links.', costume: 'Silver thermal coats, sealed gloves, layered boots and dim bio-light markers.', color: '#6DAFE2', position: [-0.58,1.64,0.98], latitude: 67, longitude: -24 },
  { id: 'aerion', name: 'AERION MERIDIA', shortName: 'Aerion Meridia', subtitle: 'THE LIVING STORM BELT', climate: 'Temperate / electrically active winds', temperature: '9–29°C · inhabited climate corridor', terrain: 'Cloud valleys, storm-balanced uplands and densely inhabited coasts', infrastructure: ['Atmospheric stabilization towers', 'Suspended farms', 'Velair Prime capital network'], agriculture: 'Mist-fed sky farms and sheltered terrace agriculture.', transport: 'Defined aerial lanes, maglev bridges and wind-rated scout craft.', costume: 'Dark titanium smart fabrics, bronze ceremonial trim and restrained turquoise instruments.', color: '#59DBE7', position: [-1.05,0.22,1.68], latitude: 12, longitude: -35 }
];
export const chapters: readonly Chapter[] = [
  { id:'contact', number:'01', title:'FIRST CONTACT', caption:'Year 3186 / Uncharted system', start:0, end:.2, camera:[0,0,8.5], target:[0,0,0] },
  { id:'approach', number:'02', title:'ORBITAL APPROACH', caption:'Concord orbital installation', start:.2, end:.4, camera:[.45,.1,5.4], target:[0,0,0] },
  { id:'entry', number:'03', title:'ATMOSPHERIC ENTRY', caption:'Aerion Meridia / Storm corridor', start:.4, end:.6, camera:[.1,.12,2.15], target:[0,0,0] },
  { id:'reveal', number:'04', title:'FIRST REVEAL', caption:'Velair Prime / Outer airspace', start:.6, end:.8, camera:[0,.15,1.3], target:[0,0,-2] },
  { id:'arrival', number:'05', title:'ARRIVAL', caption:'Capital of the Lexorian Concord', start:.8, end:1, camera:[0,.08,.7], target:[0,0,-3] }
];
export function getRegion(id: RegionId): Region { const region = regions.find(item => item.id === id); if (!region) throw new Error(`Unknown region: ${id}`); return region; }
/** Extension contracts, not incomplete Phase 2–4 user interfaces. */
export interface Settlement { id:string; region:RegionId; name:string; population?:number; architectureAsset:string; farmingSystems:readonly string[]; }
export interface CultureEntry { id:string; region:RegionId|'concord'; category:'food'|'festival'|'language'|'government'|'costume'|'accessory'; title:string; body:string; assetKey?:string; }
export interface Character { id:string; name:string; role:string; region:RegionId; portraitAsset:string; costumeReference:string; relationships:readonly {characterId:string;relationship:string}[]; }
export interface VeinNode { id:string; region:RegionId; function:'climate'|'energy'|'ecology'; status:'stable'|'degraded'|'offline'; }
export interface CrisisDecision { id:string; title:string; consequences:Readonly<Record<string,number>>; outcomeId:string; }
export interface CrisisOutcome { id:string; title:string; decisions:readonly string[]; panelAssets:readonly [string,string,string,string]; endingAsset:string; }
