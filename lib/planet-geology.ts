/** Original mineral-world parameters; no terrestrial map or geography is used. */
export const planetEnvelopeRadius=2.22;
export interface CrystalCluster {direction:readonly [number,number,number];height:number;width:number;bronze:boolean;}
const random=(i:number)=>{const n=Math.sin(i*127.1+311.7)*43758.5453;return n-Math.floor(n);};
export function crystalClusters(count=260):readonly CrystalCluster[]{
 const centers=[[.67,.31,.67],[-.72,-.41,.49],[.17,.81,-.56],[-.32,-.68,-.66]];
 return Array.from({length:count},(_,i)=>{const c=centers[i%centers.length],v=c.map((n,k)=>n+(random(i*7+k+4)-.5)*.48),length=Math.hypot(...v);return {direction:v.map(n=>n/length) as unknown as readonly [number,number,number],height:.018+random(i+93)*.052,width:.55+random(i+49)*1.2,bronze:i%7===0};});
}
/** Fit the atmosphere plus displaced crystal envelope inside both frustum dimensions. */
export function finalPlanetFraming(aspect:number,boundary=1){
 const a=Math.max(.25,Math.min(5,aspect)),tanV=Math.tan(42*Math.PI/360),tanH=tanV*a;
 const fillY=.56,fillX=.78,halfAngle=Math.min(Math.atan(tanV*fillY),Math.atan(tanH*fillX));
 const distance=planetEnvelopeRadius/Math.sin(halfAngle)*boundary;
 return {position:[1.25,.1,distance] as const,target:[1.25,.1-distance*tanV*.21,0] as const,distance};
}
