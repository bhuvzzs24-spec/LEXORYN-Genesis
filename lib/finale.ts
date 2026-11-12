export const emergencyRegions=[{name:'PYRAVAR',asset:'/assets/story/desert.webp',effect:'desert',risk:'Heat sinks saturate. Reservoir access is threatened.'},{name:'CRYONTH',asset:'/assets/story/ice.webp',effect:'ice',risk:'Geothermal exchange fails. Habitats lose their thermal margin.'},{name:'AERION MERIDIA',asset:'/assets/story/storm.webp',effect:'storm',risk:'Electrical shear closes aerial lanes and damages stabilizers.'}] as const;
export const emergencyRegion=(progress:number)=>emergencyRegions[Math.min(2,Math.floor(Math.max(0,progress)*3))];
export function finaleAssetRequest(id:number,progress:number,original:string,outcomeAsset?:string){
 if(id===51)return emergencyRegion(progress).asset;
 if(id===53||id===55)return `/assets/finale/${outcomeAsset??'planetary-emergency'}.webp`;
 return original;
}
export {showcaseShots,showcaseFrame,showcaseDurationSeconds,montageDurationSeconds} from '@/data/pacing';
