export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
export const chapterAt = (progress: number) => Math.min(4, Math.floor(clamp(progress) * 5));
export const chapterProgress = (chapter: number) => [0.005,0.28,0.52,0.73,0.97][Math.max(0,Math.min(4,chapter))];
export const journeyStops = [
 {at:0,position:[0,0.3,9.2],target:[0.65,0.1,0]},
 {at:0.22,position:[0.3,0.38,6.9],target:[1.1,0.08,0]},
 {at:0.42,position:[1.2,0.3,3.3],target:[1.2,0.2,-2]},
 {at:0.55,position:[1.2,0.25,0.7],target:[0.4,0,-10]},
 {at:0.70,position:[0.6,0.6,-10],target:[0,0,-42]},
 {at:0.85,position:[0.1,0.8,-18.5],target:[0,0.4,-42]},
 {at:1,position:[0,1.15,-21.5],target:[0,1.35,-42]},
] as const;
export function sampleJourney(progress:number) {
 const p=clamp(progress); let a=0;
 while(a<journeyStops.length-2&&p>journeyStops[a+1].at)a++;
 const start=journeyStops[a],end=journeyStops[a+1],t=smooth((p-start.at)/(end.at-start.at));
 return {position:start.position.map((v,i)=>v+(end.position[i]-v)*t) as [number,number,number],target:start.target.map((v,i)=>v+(end.target[i]-v)*t) as [number,number,number]};
}
