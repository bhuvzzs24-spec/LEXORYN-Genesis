/** Relative manual-scroll distances; no scene or interaction is removed. */
export function manualSceneWeight(id:number,original:number):number{
 if(id===34)return .12;
 if(id<=7)return original*.48;
 if(id<=14)return original*.32;
 if(id===15)return original*.55;
 if(id<=21)return original*.36;
 if(id<=24)return original*.42;
 if(id<=28)return original*.34;
 if(id<=33)return original*.32;
 return original;
}
export interface ShowcaseShot {readonly sceneIndex:number;readonly seconds:number;readonly localStart:number;readonly localEnd:number;readonly montage:boolean;}
/** Five principal highlights plus a brief activation pulse span exactly ten seconds. */
export const montageShots:readonly ShowcaseShot[]=[[0,2],[6,1.5],[9,2],[19,1.5],[30,2],[33,1]].map(([sceneIndex,seconds])=>({sceneIndex,seconds,localStart:.15,localEnd:.72,montage:true}));
export const storyShots:readonly ShowcaseShot[]=Array.from({length:22},(_,i)=>({sceneIndex:i+34,seconds:i===0?11:i===17?18:i===19?14:i===21?12:8,localStart:.12,localEnd:.78,montage:false}));
/** Default journey: transition is included in each four-second shot. */
export const showcaseShots:readonly ShowcaseShot[]=Array.from({length:56},(_,sceneIndex)=>({sceneIndex,seconds:4,localStart:0,localEnd:1,montage:false}));
export const montageDurationSeconds=montageShots.reduce((n,s)=>n+s.seconds,0);
export const showcaseDurationSeconds=showcaseShots.reduce((n,s)=>n+s.seconds,0);
export function showcaseFrame(elapsedMs:number){
 let start=0;for(let index=0;index<showcaseShots.length;index++){const shot=showcaseShots[index],end=start+shot.seconds*1000;if(elapsedMs<end)return{index,shot,elapsedInShot:Math.max(0,elapsedMs-start),complete:false};start=end;}
 return{index:showcaseShots.length-1,shot:showcaseShots[showcaseShots.length-1],elapsedInShot:showcaseShots[showcaseShots.length-1].seconds*1000,complete:true};
}
