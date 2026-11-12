import primary from './dynasty-media.json';
import civilization from './dynasty-civilization-media.json';
import crisis from './dynasty-crisis-media.json';
import props from './dynasty-props-media.json';
export interface DynastyMedia {src:string;mobileSrc?:string;width:number;height:number;kind:'generated';alpha:boolean;sceneIds?:number[];characterId?:string;portraitFor?:string;outcomeId?:string;inspectionId?:string;}
export const dynastyMedia:Readonly<Record<string,DynastyMedia>>={...primary,...civilization,...crisis,...props} as Record<string,DynastyMedia>;
export const dynastySceneAssets:Readonly<Record<number,string>>=Object.fromEntries(Object.entries(dynastyMedia).filter(([key,a])=>!a.outcomeId&&key!=='crisis-comic-strip').flatMap(([,a])=>(a.sceneIds??[]).map(id=>[id,a.src])));
