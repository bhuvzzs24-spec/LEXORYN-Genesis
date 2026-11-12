import {dynastyMedia,dynastySceneAssets} from '@/data/dynasty-runtime';
export const emergencyRegions=[{name:'PYRAVAR',asset:dynastySceneAssets[16]??'/assets/story/desert.webp',effect:'desert',risk:'Heat sinks saturate. Reservoir access is threatened.'},{name:'CRYONTH',asset:dynastySceneAssets[18]??'/assets/story/ice.webp',effect:'ice',risk:'Geothermal exchange fails. Habitats lose their thermal margin.'},{name:'AERION MERIDIA',asset:dynastySceneAssets[20]??'/assets/story/storm.webp',effect:'storm',risk:'Electrical shear closes aerial lanes and damages stabilizers.'}] as const;
export const emergencyRegion=(progress:number)=>emergencyRegions[Math.min(2,Math.floor(Math.max(0,progress)*3))];
export function finaleAssetRequest(id:number,progress:number,original:string,outcomeAsset?:string){
 if(id===51)return emergencyRegion(progress).asset;
 if(id===53||id===55)return outcomeArtwork(outcomeAsset??'planetary-emergency');
 return original;
}
export {showcaseShots,showcaseFrame,showcaseDurationSeconds,montageDurationSeconds} from '@/data/pacing';

export function outcomeArtwork(asset:string){const id=({'aftermath-central':'shelter','aftermath-regional':'regional','aftermath-covenant':'covenant'} as Record<string,string>)[asset];return Object.values(dynastyMedia).find(a=>id&&a.outcomeId===id)?.src??`/assets/finale/${asset}.webp`;}
