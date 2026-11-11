export const emergencyRegions=[{name:'PYRAVAR',asset:'/assets/story/desert.webp',effect:'desert',risk:'Heat sinks saturate. Reservoir access is threatened.'},{name:'CRYONTH',asset:'/assets/story/ice.webp',effect:'ice',risk:'Geothermal exchange fails. Habitats lose their thermal margin.'},{name:'AERION MERIDIA',asset:'/assets/story/storm.webp',effect:'storm',risk:'Electrical shear closes aerial lanes and damages stabilizers.'}] as const;
export const emergencyRegion=(progress:number)=>emergencyRegions[Math.min(2,Math.floor(Math.max(0,progress)*3))];
export function finaleAssetRequest(id:number,progress:number,original:string,outcomeAsset?:string){
 if(id===51)return emergencyRegion(progress).asset;
 if(id===53||id===55)return `/assets/finale/${outcomeAsset??'planetary-emergency'}.webp`;
 return original;
}
export const showcaseScenes=[0,5,7,15,17,19,21,22,23,28,32,35,41,45,49,51,53,54,55] as const;
export const showcaseShotMs=12000;
export const showcaseDurationSeconds=showcaseScenes.length*showcaseShotMs/1000;
