import manifest from '@/data/story-media.json';
import {assets} from '@/data/assets';
export interface SceneMedia {src:string;mobileSrc?:string;width:number;height:number;kind:'generated'|'provided';source?:string;}
const registry=manifest.generated as Record<string,SceneMedia>;
export function resolveSceneAsset(request:string,low=false):SceneMedia {
 const key=request.split('/').at(-1)?.replace('.webp','')??'';
 const media=registry[key]??registry.clouds;
 if(media)return {...media,src:low&&media.mobileSrc?media.mobileSrc:media.src};
 return {src:assets.atmosphericClouds.src,width:assets.atmosphericClouds.width,height:assets.atmosphericClouds.height,kind:'generated'};
}
export const generatedSceneMedia=registry;
