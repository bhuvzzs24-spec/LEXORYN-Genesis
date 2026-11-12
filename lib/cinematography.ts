import {finalPlanetFraming} from './planet-geology';
import {storyScenes,type StoryVector} from '@/data/story';

export interface CinematicCameraPose {
 readonly position:StoryVector;
 readonly target:StoryVector;
}
const pose=(position:StoryVector,target:StoryVector):CinematicCameraPose=>({position,target});

/**
 * Shared shot boundaries, rather than28 independent zooms. Node7 is the cloud-covered
 * spatial hand-off: the camera never dives to z-5.8 then races backwards to z12.
 * World geometry is framed at distinct near/middle/far depths by the caller.
 */
const authoredNodes:readonly CinematicCameraPose[]=[
 pose([0,.35,10.5],[.75,.1,0]),
 pose([.2,.3,9],[.65,.1,0]),
 pose([-1.3,.7,8.3],[.5,.2,0]),
 pose([.6,.35,6.2],[1,.1,0]),
 pose([.9,.25,5.6],[1.15,.1,0]),
 pose([1.1,.2,4.1],[1.25,.05,-.2]),
 pose([1.22,.38,3.15],[1.1,.2,-16]),
 pose([.35,1,10.4],[.15,.45,-20]),
 // Capital: leftward establishing drift, following skyway, station, terraces, spires.
 pose([-1.8,.75,9.6],[-.65,.25,-20]),
 pose([1.5,-.25,8.8],[.4,.15,-18]),
 pose([-1.4,1.1,10.1],[-.5,.45,-18]),
 pose([1.2,.3,9.5],[.3,.2,-20]),
 pose([-.8,1.5,11.1],[-.3,.8,-20]),
 pose([.4,.18,10],[.1,.1,-17]),
 // Orbital climate overview enters/exits under the environment transition veil.
 pose([.1,.35,10],[.65,.1,0]),
 pose([.2,.48,10.6],[.2,.25,-17]),
 pose([.9,.25,9.8],[.3,.2,-18]),
 pose([-.5,.12,9.3],[-.1,.1,-17]),
 pose([-.9,.8,10.4],[-.3,.55,-20]),
 pose([.5,.25,10],[.1,.15,-18]),
 pose([1,.8,10.5],[.25,.5,-20]),
 pose([-.45,.6,11.4],[-.1,.4,-20]),
 // Cuisine, atelier, object study, council, commons and ecosystem have distinct sightlines.
 pose([.3,.05,10.4],[.05,.05,-17]),
 pose([-.5,.25,11],[-.1,.18,-18]),
 pose([.45,-.12,11.4],[.1,-.04,-17]),
 pose([.05,.9,12],[0,.5,-20]),
 pose([.55,.25,10.8],[.15,.15,-18]),
 pose([-.6,.5,11.3],[-.2,.3,-20]),
 pose([.1,1.3,12.2],[0,.8,-21]),
 pose([-.8,1.5,11.4],[0,.6,-20]),
 pose([.65,.2,10.8],[.1,.15,-18]),
 pose([-.45,.35,11.4],[-.1,.1,-18]),
 pose([.8,.8,10.6],[.2,.45,-20]),
 pose([-.6,.3,11.3],[-.1,.1,-18]),
 pose([.2,1.3,10.8],[0,.4,-19]),
 pose([-.4,.5,11.8],[0,.2,-18]),
 pose([.5,.25,11.2],[0,.15,-18]),
 pose([-.6,.5,11.4],[0,.2,-18]),
 pose([.4,.2,11.1],[0,.1,-18]),
 pose([-.5,.4,11.5],[0,.2,-18]),
 pose([.5,.6,11.3],[0,.3,-18]),
 pose([-.4,.25,12],[0,.1,-18]),
 pose([.45,.7,11.4],[0,.3,-20]),
 pose([-.7,.5,11.4],[-.1,.2,-18]),
 pose([.65,.3,10.8],[.1,.1,-18]),
 pose([-.5,-1.8,8.8],[0,-1.5,-18]),
 pose([.6,-2.8,7.8],[0,-2,-18]),
 pose([-.7,.4,11.3],[0,.2,-18]),
 pose([.6,.65,11.6],[0,.3,-18]),
 pose([-.55,.9,11.2],[0,.4,-18]),
 pose([.5,.5,10.8],[0,.2,-18]),
 pose([-.6,.6,11.4],[0,.3,-18]),
 pose([.4,.45,11.2],[0,.2,-18]),
 pose([-.45,.5,11.4],[0,.2,-18]),
 pose([.4,.8,12],[0,.3,-18]),
 pose([.1,.35,11.8],[.75,.1,0]),
 pose([0,.35,10.5],[.75,.1,0]),
];

const clamp=(value:number,min=0,max=1)=>Number.isNaN(value)?min:Math.max(min,Math.min(max,value));
const durationWeights=storyScenes.slice(0,authoredNodes.length-1).map(scene=>scene.duration);
const nodeTimes=[0];
for(const duration of durationWeights)nodeTimes.push(nodeTimes[nodeTimes.length-1]+duration);

/**
 * A small local arc has zero first derivative at both ends, preserving the shared
 * Hermite velocity. It brings orbital parallax and varied city travel without a shake.
 */
const shotArcs:Readonly<Record<number,StoryVector>>={
 1:[-.18,.03,0],2:[.11,.02,-.06],4:[-.12,.025,0],
 7:[-.12,.08,0],8:[.15,.04,-.12],9:[-.10,.10,.04],10:[.13,.035,0],11:[-.13,.07,.05],
 12:[.08,.02,0],15:[.12,.025,0],17:[-.08,.04,0],19:[.08,.04,0],27:[-.10,.07,0],
};

function frameNode(node:CinematicCameraPose,index:number,mobile:boolean,aspect:number):CinematicCameraPose {
 if(index>=55){const framing=finalPlanetFraming(aspect,index===55?1.035:1);return {position:framing.position,target:framing.target};}
 if(!mobile)return node;
 const orbital=index<=5||index===14||index===15||index>=55;
 // Fit shared boundary nodes, not only the active shot. That is essential at05→06/14→15.
 return {
  position:[node.position[0]*(orbital?1:.52),node.position[1],node.position[2]*(orbital?1.32:1)],
  target:[orbital?1.1:node.target[0]*.52,node.target[1],node.target[2]],
 };
}

function makeRoute(mobile:boolean,aspect:number){
 const nodes=authoredNodes.map((node,index)=>frameNode(node,index,mobile,aspect));
 const slope=(key:'position'|'target',index:number,axis:number)=>{
  if(index===0||index===nodes.length-1)return 0;
  const before=(nodes[index][key][axis]-nodes[index-1][key][axis])/(nodeTimes[index]-nodeTimes[index-1]);
  const after=(nodes[index+1][key][axis]-nodes[index][key][axis])/(nodeTimes[index+1]-nodeTimes[index]);
  // Monotone tangent limiting prevents camera overshoot at a close planetary pass.
  if(before*after<=0)return 0;
  const value=(before+after)*.34;
  return Math.sign(value)*Math.min(Math.abs(value),3*Math.abs(before),3*Math.abs(after));
 };
 const tangents=nodes.map((_,index)=>({
  position:[slope('position',index,0),slope('position',index,1),slope('position',index,2)] as StoryVector,
  target:[slope('target',index,0),slope('target',index,1),slope('target',index,2)] as StoryVector,
 }));
 return {nodes,tangents};
}
const routes=new Map<string,ReturnType<typeof makeRoute>>();
function route(mobile:boolean,aspect:number){const key=`${mobile}:${aspect.toFixed(3)}`;let value=routes.get(key);if(!value){value=makeRoute(mobile,aspect);if(routes.size>8)routes.clear();routes.set(key,value);}return value;}

function interpolate(a:StoryVector,b:StoryVector,ta:StoryVector,tb:StoryVector,p:number,duration:number):StoryVector {
 const p2=p*p,p3=p2*p;
 const h00=2*p3-3*p2+1,h10=p3-2*p2+p,h01=-2*p3+3*p2,h11=p3-p2;
 return [
  h00*a[0]+h10*ta[0]*duration+h01*b[0]+h11*tb[0]*duration,
  h00*a[1]+h10*ta[1]*duration+h01*b[1]+h11*tb[1]*duration,
  h00*a[2]+h10*ta[2]*duration+h01*b[2]+h11*tb[2]*duration,
 ];
}

/** Pure scroll sampling: deterministic, reversible and C1 across weighted story boundaries. */
export function sampleCinematicCamera(sceneIndex:number,localProgress:number,mobile=false,aspect=mobile?.55:1.6):CinematicCameraPose {
 const index=Math.floor(clamp(sceneIndex,0,authoredNodes.length-2)),p=clamp(localProgress);
 const {nodes,tangents}=route(mobile,aspect);
 if(p===0)return nodes[index];
 if(p===1)return nodes[index+1];
 const duration=durationWeights[index];
 const position=interpolate(nodes[index].position,nodes[index+1].position,tangents[index].position,tangents[index+1].position,p,duration);
 const target=interpolate(nodes[index].target,nodes[index+1].target,tangents[index].target,tangents[index+1].target,p,duration);
 const arc=shotArcs[index];
 if(!arc)return {position,target};
 const lift=16*p*p*(1-p)*(1-p)*(mobile?.55:1);
 return {position:[position[0]+arc[0]*lift,position[1]+arc[1]*lift,position[2]+arc[2]*lift],target};
}

/** Bounded smooth layer hand-off, independent of ambient time or frame rate. */
export function cinematicLayerBlend(localProgress:number):number {
 const p=clamp((localProgress-.78)/.22);
 return clamp(p*p*p*(p*(p*6-15)+10));
}
