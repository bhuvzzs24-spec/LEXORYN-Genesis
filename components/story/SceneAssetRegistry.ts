import manifest from '@/data/story-media.json';
import finale from '@/data/finale-media.json';
import correctionMedia from '@/data/correction-media.json';
import {assets} from '@/data/assets';
import visual from '@/data/visual-assets.json';
import type {InspectionMedia} from './InspectionExhibit';
export interface SceneMedia {src:string;mobileSrc?:string;width:number;height:number;kind:'generated'|'provided';source?:string;}
const correctionRegistry=correctionMedia as Record<string,SceneMedia>;
const finalRegistry=finale as Record<string,SceneMedia>;
const registry=manifest.generated as Record<string,SceneMedia>;
const upgraded=visual.generated as Record<string,SceneMedia>;
const atlases=visual.atlases as Record<string,SceneMedia>;
const replacements:Record<string,string>={city:'city-far',market:'market-far',cuisine:'cuisine-far',objects:'objects-far',desert:'desert-far',ice:'ice-far',storm:'storm-far',convergence:'festival-far'};
export function resolveSceneAsset(request:string,low=false):SceneMedia {
 const key=request.split('/').at(-1)?.replace('.webp','')??'';
 const media=correctionRegistry[key]??finalRegistry[key]??upgraded[key]??upgraded[replacements[key]]??registry[key]??registry.clouds;
 if(media)return {...media,src:low&&media.mobileSrc?media.mobileSrc:media.src};
 return {src:assets.atmosphericClouds.src,width:assets.atmosphericClouds.width,height:assets.atmosphericClouds.height,kind:'generated'};
}
export const generatedSceneMedia=registry;
export function sceneDepthAssets(request:string){const key=request.split('/').at(-1)?.replace('.webp','')??'';const family=['market','market-far'].includes(key)?'market':['city','city-far','convergence','festival-far'].includes(key)?'city':null;return family?{midgroundAsset:upgraded[`${family}-midground`]?.src,foregroundAsset:upgraded[`${family}-foreground`]?.src}:{};}
const inspections:Record<string,InspectionMedia>={};
function atlas(name:string,ids:readonly string[],cols:number,rows:number){const a=atlases[name];if(!a)return;ids.forEach((id,i)=>{inspections[id]={src:a.src,width:a.width,height:a.height,kind:'generated',transparent:true,crop:{x:i%cols/cols,y:Math.floor(i/cols)/rows,width:1/cols,height:1/rows}};});}
atlas('food-atlas',['aether-grain','cryo-bloom','sky-kelp','solar-fruit','mistwater-broth','lumifungus'],3,2);
atlas('gear-atlas',['neural-bracelet','climate-visor','translation-pendant','ceremonial-crown','environmental-scanner','communication-jewelry','medical-sensor','reservoir-loop','field-laboratories'],3,3);
atlas('boots-atlas',['heat-walkers','ice-grip-boots','sky-grip-footwear'],3,1);
atlas('attire-atlas',['pyravar-attire','cryonth-attire','aerion-attire','field-professionals','defense-armor','convergence-attire'],3,2);
export const inspectionMedia:Readonly<Record<string,InspectionMedia>>=inspections;
