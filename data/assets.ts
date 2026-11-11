/** Central replaceable cinematic asset registry. Paths are public-root URLs. */
export type AssetStatus = 'provided' | 'generated' | 'procedural' | 'missing';
export interface AssetDefinition {
 readonly src: string;
 readonly alt: string;
 readonly width: number;
 readonly height: number;
 readonly status: AssetStatus;
 readonly use: 'scene'|'direction'|'future';
 readonly fallback?: string;
}
export const assets = {
 cityAerial: {src:'/assets/regions/atmospheric-clouds.webp',alt:'Generated storm-cloud approach to an original bronze and cyan city.',width:1672,height:941,status:'generated',use:'scene',fallback:'/assets/regions/atmospheric-clouds.webp'},
 cityClouds: {src:'/assets/regions/atmospheric-clouds.webp',alt:'Generated layered atmospheric clouds opening over an original city.',width:1672,height:941,status:'generated',use:'scene'},
 stationReference: { src:'/assets/technology/concord-orbital-station.webp',alt:'Detailed silver orbital ring station with bronze solar arrays, cyan machinery and warm docking bays.',width:1072,height:794,status:'missing',use:'direction' },
 engineeredWorldReference: {src:'/assets/planet/engineered-world-reference.webp',alt:'Worn dark engineered mineral sphere with golden rim light and deep concentric cavities.',width:1108,height:840,status:'missing',use:'direction'},
 stormCockpit: {src:'/assets/regions/meridia-storm-cockpit.webp',alt:'A gloved pilot navigates a rain-covered cockpit through a cyan-gray lightning corridor.',width:1100,height:628,status:'missing',use:'direction'},
 atmosphericClouds: {src:'/assets/regions/atmospheric-clouds.webp',alt:'Layered storm-blue clouds and warm amber sunlight open over a distant bronze and cyan-lit alien capital.',width:1672,height:941,status:'generated',use:'scene'},
 hangar: {src:'/assets/technology/orbital-hangar.webp',alt:'Silver orbital shuttles in a monumental steel hangar.',width:1098,height:624,status:'missing',use:'future'},
 sanctum: {src:'/assets/cities/concord-sanctum.webp',alt:'Golden civic domes and suspended bridges above cloud valleys.',width:1102,height:730,status:'missing',use:'future'},
 market: {src:'/assets/culture/concord-market.webp',alt:'Alien traders wearing layered ochre and teal robes in a brass-lit market.',width:1096,height:1104,status:'missing',use:'future'},
 convergence: {src:'/assets/culture/convergence-hall.webp',alt:'A monumental gold ceremonial ring with robed citizens and cyan energy inscriptions.',width:1102,height:1114,status:'missing',use:'future'},
 defenseCommander: {src:'/assets/characters/defense-commander.webp',alt:'Defense commander wearing articulated charcoal armor with restrained cyan light.',width:1068,height:1072,status:'missing',use:'future'},
 skyBike: {src:'/assets/vehicles/sky-bike.webp',alt:'Helmeted rider on a silver and charcoal sky bike over a sunset megacity.',width:1086,height:1116,status:'missing',use:'future'},
 codexVein: {src:'/assets/technology/codex-vein.webp',alt:'A colossal bronze reactor ring emitting white-gold light.',width:1098,height:558,status:'missing',use:'future'},
 cryonthRupture: {src:'/assets/crisis/cryonth-rupture.webp',alt:'A dark mineral sphere splits with cyan energy above a frozen plain.',width:1096,height:618,status:'missing',use:'future'}
} as const satisfies Record<string,AssetDefinition>;
export type AssetKey = keyof typeof assets;
export const phase1AssetKeys: readonly AssetKey[] = ['cityAerial','cityClouds','atmosphericClouds'];
