import {dynastyMedia} from './dynasty-runtime';
/** Replace this card, not the rendering engine, when organizers reveal the mystery crisis. */
export const resourceKeys=['safety','energy','water','food','resilience','ecosystem','trust'] as const;
export type ResourceKey=typeof resourceKeys[number];
export type Resources=Readonly<Record<ResourceKey,number>>;
export type ResourceDelta=Partial<Record<ResourceKey,number>>;
export interface CrisisDecision {id:string;title:string;summary:string;tradeoff:string;delta:ResourceDelta;voice:string;}
export interface CrisisOutcome {id:string;title:string;line:string;asset:string;requirements:ResourceDelta;maxima?:ResourceDelta;comicAftermath:string;}
export interface CrisisConfig {id:string;title:string;description:string;affectedRegions:readonly string[];initial:Resources;rounds:number;hazards:readonly ResourceDelta[];decisions:readonly CrisisDecision[];outcomes:readonly CrisisOutcome[];fallbackOutcome:string;comic:{strip:string;columns:number;labels:readonly string[]};}
export const crisisConfig:CrisisConfig={
 id:'concord-charge-front-v1',title:'THE SHEAR FRONT',description:'A charged atmospheric front disrupts central stabilizers. Native corridors absorb the overflow.',affectedRegions:['pyravar','cryonth','aerion'],initial:{safety:62,energy:78,water:62,food:64,resilience:44,ecosystem:38,trust:50},rounds:3,
 hazards:[{safety:-5,energy:-4,water:-3,food:-2},{safety:-7,energy:-6,water:-4,food:-3,ecosystem:-2},{safety:-6,energy:-5,water:-4,food:-3,ecosystem:-2}],
 decisions:[
 {id:'central',title:'REPAIR THE CENTRAL NETWORK',summary:'Restore city shields and concentrated power.',tradeoff:'Fast protection; native corridors bear the thermal load.',delta:{safety:20,energy:-16,water:8,food:5,resilience:-8,ecosystem:-18,trust:-4},voice:'KAOR / “A shield buys us time. It cannot buy agreement.”'},
 {id:'regional',title:'BUILD REGIONAL STABILIZERS',summary:'Give each climate a resilient local energy loop.',tradeoff:'Construction consumes scarce reserves before protection improves.',delta:{safety:9,energy:-14,water:-4,food:-3,resilience:27,ecosystem:12,trust:9},voice:'NYRA / “Let one failure stay one failure.”'},
 {id:'evacuate',title:'EVACUATE EXPOSED COMMUNITIES',summary:'Use the fleet to move people into safe habitats.',tradeoff:'Protect lives now; shelters consume water, food and transport power.',delta:{safety:27,energy:-9,water:-13,food:-12,resilience:-3,ecosystem:4,trust:8},voice:'AARYAN / “Nobody becomes an acceptable loss.”'},
 {id:'covenant',title:'LISTEN TO ORIGIN AND THE MYR',summary:'Reroute the Vein around native ecological corridors.',tradeoff:'A slower protective response restores water, food and shared trust.',delta:{safety:-3,energy:4,water:16,food:15,resilience:12,ecosystem:29,trust:20},voice:'ELARA / “Ask what the world needs to become.”'},
 ],
 outcomes:[
 {id:'fracture',title:'A WORLD STILL IN DANGER',line:'The reserves broke before the front. Mutual aid continues beyond this ending.',asset:'planetary-emergency',requirements:{},maxima:{safety:34},comicAftermath:'planetary-emergency'},
 {id:'covenant',title:'THE LIVING COVENANT',line:'Vaelori, Myr and humans share authority with the planetary intelligence.',asset:'aftermath-covenant',requirements:{ecosystem:60,trust:65,safety:35},comicAftermath:'aftermath-covenant'},
 {id:'regional',title:'THE REGIONAL ACCORD',line:'Independent regional loops contain failures. Rebuilding becomes a shared local craft.',asset:'aftermath-regional',requirements:{resilience:65,safety:35},comicAftermath:'aftermath-regional'},
 {id:'shelter',title:'THE SHIELDED CONCORD',line:'Vaelori central control endures. The shield saves lives; ecological and minority debts remain.',asset:'aftermath-central',requirements:{safety:70},comicAftermath:'aftermath-central'},
 {id:'fragile',title:'THE LONG REPAIR',line:'The immediate front passes. Stressed reserves demand patient cooperation and another choice.',asset:'aftermath-regional',requirements:{},comicAftermath:'aftermath-regional'},
 ],fallbackOutcome:'fragile',comic:{strip:dynastyMedia['crisis-comic-strip']?.src??'/assets/finale/crisis-comic-strip.webp',columns:3,labels:['WARNING','DISASTER','DECISION','AFTERMATH']},
};
export const resourceLabels:Record<ResourceKey,string>={safety:'Population safety',energy:'Energy',water:'Water',food:'Food',resilience:'Infrastructure',ecosystem:'Ecosystem',trust:'Public trust'};
