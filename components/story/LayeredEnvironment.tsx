'use client';

import {Suspense,memo,useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useCinematicTexture} from './useCinematicTexture';
import * as THREE from 'three';
import type {ParallaxEnvironmentProps} from './WorldLayers';

export interface EnvironmentDepthLayer {
 src:string;
 depth?:number;
 width?:number;
 position?:readonly [number,number];
 opacity?:number;
 drift?:number;
}
export interface LayeredEnvironmentProps extends ParallaxEnvironmentProps {
 midgroundAsset?:string;
 foregroundAsset?:string;
 layers?:readonly EnvironmentDepthLayer[];
 /** Scale architectural framing only, leaving each photographic layer correctly proportioned. */
 architecture?:boolean;
}
const bound=(p:number)=>Math.max(0,Math.min(1,p));
const ease=(p:number)=>{const x=bound(p);return x*x*(3-2*x);};
function regionOf(variant:string){return /desert|solar|pyravar/.test(variant)?'desert':/ice|cryo/.test(variant)?'ice':/storm|meridia/.test(variant)?'storm':/market|cuisine|food/.test(variant)?'market':'city';}
const shades={
 city:{metal:'#31424e',edge:'#9a7952',light:'#6cbbc4',stone:'#192c35'},
 desert:{metal:'#3c3430',edge:'#b3955e',light:'#d9b366',stone:'#24201c'},
 ice:{metal:'#647986',edge:'#a0afb5',light:'#97d3df',stone:'#263541'},
 storm:{metal:'#334752',edge:'#8f7f65',light:'#6eb6bc',stone:'#21323a'},
 market:{metal:'#4b463d',edge:'#a58758',light:'#e0bd7d',stone:'#2d2d29'},
};

/** Alpha artwork is a distinct spatial layer; texture UVs retain the native aspect ratio. */
function ImageLayer({src,depth=-12,width=38,position=[0,.6],opacity=1,drift=.4,progress,order=0}:{progress:number;order?:number}&EnvironmentDepthLayer){
 const texture=useCinematicTexture(src),group=useRef<THREE.Group>(null),{gl}=useThree();
 useEffect(()=>{let changed=false;if(texture.colorSpace!==THREE.SRGBColorSpace){texture.colorSpace=THREE.SRGBColorSpace;changed=true;}const anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());if(texture.anisotropy!==anisotropy){texture.anisotropy=anisotropy;changed=true;}if(changed)texture.needsUpdate=true;},[texture,gl]);
 const image=texture.image as {width?:number;height?:number};
 const aspect=image?.width&&image?.height?image.width/image.height:16/9;
 useFrame(()=>{if(order===-10&&opacity>=.5)gl.domElement.dataset.environmentAsset=src;if(group.current){group.current.position.x=position[0]+(bound(progress)-.5)*drift;group.current.position.z=depth+ease(progress)*Math.min(.6,Math.abs(drift)*.3);}});
 return <group ref={group} position={[position[0],position[1],depth]}>
  <mesh renderOrder={order}><planeGeometry args={[width,width/aspect]}/><meshBasicMaterial map={texture} transparent opacity={bound(opacity)} alphaTest={.006} depthWrite={false} toneMapped={false}/></mesh>
 </group>;
}

/** Fine fabrication grain is anchored to local geometry, never to the screen/camera. */
function brushedSurface(material:THREE.MeshStandardMaterial){
 material.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vLexSurface;').replace('#include <begin_vertex>','#include <begin_vertex>\nvLexSurface=position;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vLexSurface;').replace('#include <color_fragment>','#include <color_fragment>\nfloat lexGrain=fract(sin(dot(floor(vLexSurface*430.),vec3(12.9898,78.233,37.719)))*43758.5453);\nfloat lexSeam=1.-smoothstep(.012,.035,abs(sin(vLexSurface.y*98.)));\ndiffuseColor.rgb*=.94+lexGrain*.06-lexSeam*.04;').replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+(lexGrain-.5)*.035,.08,1.);');
 };
 material.customProgramCacheKey=()=> 'lexoryn-architectural-grain-v1';
 return material;
}

function makeArchitectureResources(variant:string){
 const palette=shades[regionOf(variant)],profile=new THREE.Shape();
 profile.moveTo(-.95,-.5);profile.lineTo(.9,-.5);profile.bezierCurveTo(.96,.15,.52,.72,.16,1);profile.bezierCurveTo(-.03,.78,-.71,.5,-.95,-.5);
 const tower=new THREE.ExtrudeGeometry(profile,{depth:.85,bevelEnabled:true,bevelSize:.07,bevelThickness:.06,bevelSegments:2,steps:1});
 const metal=brushedSurface(new THREE.MeshStandardMaterial({color:palette.metal,metalness:.76,roughness:.43,transparent:true}));
 const edge=brushedSurface(new THREE.MeshStandardMaterial({color:palette.edge,metalness:.82,roughness:.39,transparent:true}));
 const stone=brushedSurface(new THREE.MeshStandardMaterial({color:palette.stone,metalness:.22,roughness:.78,transparent:true}));
 const window=new THREE.MeshStandardMaterial({color:palette.light,emissive:palette.light,emissiveIntensity:.45,metalness:.44,roughness:.3,transparent:true});
 const glass=new THREE.MeshPhysicalMaterial({color:regionOf(variant)==='ice'?'#b4d0d8':'#345768',roughness:.22,metalness:.35,transparent:true,opacity:.34,depthWrite:false});
 return {tower,box:new THREE.BoxGeometry(1,1,1),sphere:new THREE.SphereGeometry(1,24,12),cylinder:new THREE.CylinderGeometry(1,1,1,12),arc:new THREE.TorusGeometry(1,.055,6,80,Math.PI*.88),metal,edge,stone,window,glass,dispose(){[tower,metal,edge,stone,window,glass,this.box,this.sphere,this.cylinder,this.arc].forEach(v=>v.dispose());}};
}
type ArchitectureResources=ReturnType<typeof makeArchitectureResources>;
const layouts=[
 {x:-12,z:-16,height:11,width:2.4,turn:.2},
 {x:10.6,z:-14,height:15,width:2.8,turn:-.23},
 {x:-10.1,z:-5.6,height:12.5,width:2,turn:.35},
 {x:12.8,z:-2.4,height:16,width:2.1,turn:-.4},
 {x:-16.8,z:-22,height:15,width:2.8,turn:.15},
 {x:16.7,z:-20,height:18,width:2.5,turn:-.12},
];

const FacadeLights=memo(function FacadeLights({resources,low,variant}:{resources:ArchitectureResources;low:boolean;variant:string}){
 const windows=useRef<THREE.InstancedMesh>(null),palette=regionOf(variant),dummy=useMemo(()=>new THREE.Object3D(),[]);
 const instances=useMemo(()=>{
  const result:{x:number;y:number;z:number;width:number;height:number}[]=[];
  if(palette==='desert')return result;
  layouts.slice(0,low?3:6).forEach((b,bi)=>{const rows=low?10:23,lanes=low?3:6;for(let row=0;row<rows;row++)for(let lane=0;lane<lanes;lane++){
   if((row*7+lane*3+bi)%5===0)continue;
   const t=row/rows,spread=b.width*(.83-.55*t);
   result.push({x:b.x+(lane/(lanes-1)-.5)*spread,y:-5+t*b.height*.82,z:b.z+.65,width:.045+((row+lane)%3)*.015,height:.055+((row+bi)%3)*.025});
  }});return result;
 },[palette,low]);
 useEffect(()=>{if(!windows.current)return;instances.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.scale.set(v.width,v.height,.016);dummy.updateMatrix();windows.current?.setMatrixAt(i,dummy.matrix);});windows.current.instanceMatrix.needsUpdate=true;const mesh=windows.current;return()=>{mesh.dispose();};},[instances,dummy]);
 if(!instances.length)return null;
 return <instancedMesh ref={windows} args={[resources.box,resources.window,instances.length]} frustumCulled={false} dispose={null}/>;
});

const SkylineArchitecture=memo(function SkylineArchitecture({resources,low,variant}:{resources:ArchitectureResources;low:boolean;variant:string}){
 const {tower,box,sphere,cylinder,arc,metal,edge,stone,glass,window}=resources,kind=regionOf(variant);
 if(kind==='desert')return <group dispose={null}>
  {[-1,1].map((side,i)=><group key={side} position={[side*(9+i*2),-4.8,-8-i*6]} rotation={[0,side*.24,0]}>
   <mesh geometry={cylinder} material={stone} scale={[2.7,3.4,2.7]}/>
   <mesh geometry={cylinder} material={edge} position={[0,1.83,0]} scale={[2.9,.12,2.9]}/>
   <mesh geometry={box} material={metal} position={[side*.7,3.0,-.8]} rotation={[0,0,side*.38]} scale={[5.8,.12,3.2]}/>
   {[0,1,2,3,4].map(n=><mesh key={n} geometry={box} material={edge} position={[-2+n,3+(-2+n)*side*.35,-.8]} rotation={[0,0,side*.38]} scale={[.035,.06,3.3]}/>)}
   <mesh geometry={cylinder} material={metal} position={[0,-1.6,.1]} scale={[3.3,.3,3.3]}/>
   {[0,1,2].map(n=><mesh key={n} geometry={box} material={window} position={[-1.3+n*1.3,.1,2.55]} scale={[.65,.06,.03]}/>)}
  </group>)}
 </group>;
 if(kind==='ice')return <group dispose={null}>
  {[-1,1].map((side,i)=><group key={side} position={[side*(9+i*1.4),-3.9,-8-i*4]} rotation={[0,side*.25,0]}>
   <mesh geometry={cylinder} material={stone} scale={[3.1,1.5,3.1]}/>
   <mesh geometry={sphere} material={metal} position={[0,1,0]} scale={[2.7,3.2,2.7]}/>
   <mesh geometry={sphere} material={glass} position={[0,1.15,.15]} scale={[2.79,3.25,2.79]}/>
   {[-1.8,-.9,0,.9,1.8].map((x,j)=><mesh key={j} geometry={box} material={edge} position={[x,1.0,2.0-Math.abs(x)*.2]} scale={[.09,4.3,.12]}/>)}
   <mesh geometry={arc} material={window} position={[0,1.6,2.1]} scale={[2.05,2.3,1]} rotation={[0,0,.18]}/>
   <mesh geometry={cylinder} material={edge} position={[side*3.3,2.8,-1.3]} scale={[.12,6.6,.12]}/>
  </group>)}
 </group>;
 return <group dispose={null}>
  {layouts.slice(0,low?3:6).map((b,i)=><group key={i} position={[b.x,-5,b.z]} rotation={[0,b.turn,0]}>
   <mesh geometry={tower} material={metal} scale={[b.width,b.height*.72,1.3]} position={[0,b.height*.3,-.4]}/>
   <mesh geometry={tower} material={edge} scale={[b.width*.065,b.height*.72,1.44]} position={[-b.width*.43,b.height*.3,-.48]}/>
   <mesh geometry={cylinder} material={stone} position={[0,-.4,0]} scale={[b.width*.9,1.4,b.width*.9]}/>
   {[.13,.3,.48,.65].map((t,j)=><mesh key={j} geometry={box} material={edge} position={[-b.width*t*.15,b.height*t-.3,.72]} rotation={[0,0,.03]} scale={[b.width*(1.24-t),.045,.14]}/>)}
   <mesh geometry={box} material={window} position={[-b.width*.32,b.height*.38,.79]} scale={[.025,b.height*.67,.018]}/>
   <mesh geometry={cylinder} material={edge} position={[b.width*.12,b.height*.89,0]} scale={[.035,b.height*.24,.035]}/>
   {kind==='storm'?<mesh geometry={tower} material={metal} position={[b.width*.55,b.height*.12,-1]} scale={[b.width*.4,b.height*.47,.45]} rotation={[0,.5,.12]}/>:null}
  </group>)}
  <FacadeLights resources={resources} low={low} variant={variant}/>
  <group position={[-7.8,-2.7,-2]} rotation={[0,-.12,.025]}>
   <mesh geometry={box} material={metal} scale={[7.5,.18,1.7]}/>
   <mesh geometry={box} material={edge} position={[0,.13,.84]} scale={[7.5,.045,.04]}/>
   <mesh geometry={box} material={window} position={[0,-.12,.85]} scale={[7.3,.018,.018]}/>
   {[-3,-1.5,0,1.5,3].map(x=><mesh key={x} geometry={box} material={edge} position={[x,.62,.81]} scale={[.035,1.1,.035]}/>)}
  </group>
 </group>;
});

const MarketArcade=memo(function MarketArcade({resources,low}:{resources:ArchitectureResources;low:boolean}){
 return <group dispose={null}>
  {(low?[-12,-3]:[-18,-10,-2]).map((z,i)=><group key={z} position={[0,-1.5,z]}>
   <mesh geometry={resources.arc} material={i%2?resources.edge:resources.metal} scale={[6.6,6.6,1.3]} rotation={[0,0,.18]}/>
   <mesh geometry={resources.arc} material={resources.window} position={[0,.015,.055]} scale={[6.36,6.36,.25]} rotation={[0,0,.18]}/>
   {[-1,1].map(side=><group key={side} position={[side*6.35,-1.4,0]}>
    <mesh geometry={resources.cylinder} material={resources.metal} scale={[.21,3.1,.21]}/>
    <mesh geometry={resources.cylinder} material={resources.edge} position={[0,-1.55,0]} scale={[.45,.15,.45]}/>
    <mesh geometry={resources.box} material={resources.stone} position={[side*-.75,-.35,.7]} scale={[2.0,.62,1.65]}/>
    <mesh geometry={resources.box} material={resources.edge} position={[side*-.75,.01,.7]} scale={[2.18,.09,1.75]}/>
   </group>)}
  </group>)}
  {[-1,1].map(side=><group key={side} position={[side*3.8,-3.15,-10]}>
   <mesh geometry={resources.box} material={resources.edge} scale={[.06,.025,25]}/>
   <mesh geometry={resources.box} material={resources.window} position={[side*.08,.015,0]} scale={[.015,.016,25]}/>
  </group>)}
 </group>;
});

const clothVertex=`uniform float uProgress;uniform float uTime;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z+=sin(p.x*2.8+p.y*1.4+uProgress*5.+uTime*.3)*.11*(1.-uv.y);p.x+=sin(p.y*2.4+uProgress*3.+uTime*.2)*.045*(1.-uv.y);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const clothFragment=`varying vec2 vUv;uniform vec3 uColor;uniform float uOpacity;void main(){float grain=sin(vUv.x*700.)*sin(vUv.y*1100.)*.025;float border=smoothstep(.0,.04,vUv.x)*smoothstep(.0,.04,1.-vUv.x);vec3 c=uColor*(.62+vUv.y*.28+grain);c=mix(vec3(.52,.35,.16),c,border);gl_FragColor=vec4(c,uOpacity);}`;
function MarketFabrics({progress,paused,reducedMotion,resources,opacity}:{progress:number;paused:boolean;reducedMotion:boolean;resources:ArchitectureResources;opacity:number}){
 const clock=useRef(0),cloth=useMemo(()=>new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uProgress:{value:0},uColor:{value:new THREE.Color('#755d45')},uOpacity:{value:1}},vertexShader:clothVertex,fragmentShader:clothFragment,side:THREE.DoubleSide,transparent:true}),[]),geometry=useMemo(()=>new THREE.PlaneGeometry(1.3,3.2,16,24),[]);
 useEffect(()=>()=>{cloth.dispose();geometry.dispose();},[cloth,geometry]);
 useFrame((_,dt)=>{if(!paused&&!reducedMotion)clock.current+=Math.min(dt,.05);cloth.uniforms.uTime.value=clock.current;cloth.uniforms.uProgress.value=progress;cloth.uniforms.uOpacity.value=bound(opacity);cloth.depthWrite=opacity>=.9999;});
 const composition=useMemo(()=><group dispose={null}>
  {[-1,1].map((side,i)=><group key={side} position={[side*6.5,3.9,-5-i*5]} rotation={[0,side*.17,.02*side]}>
   <mesh position={[0,1.6,0]} geometry={resources.box} material={resources.edge} scale={[1.5,.06,.08]}/>
   <mesh geometry={geometry} material={cloth}/>
   <mesh position={[0,3.2,0]} geometry={resources.cylinder} material={resources.edge} scale={[.018,3.4,.018]}/>
   <mesh position={[side*.9,-1.5,0]} geometry={resources.cylinder} material={resources.edge} scale={[.16,.45,.16]}/>
   <mesh position={[side*.9,-1.5,.03]} geometry={resources.cylinder} material={resources.window} scale={[.12,.2,.12]}/>
  </group>)}
 </group>,[resources,cloth,geometry]);
 return composition;
}

const ExhibitionLedges=memo(function ExhibitionLedges({resources,variant}:{resources:ArchitectureResources;variant:string}){
 const jewelry=/object|jewel|accessor/.test(variant);
 return <group dispose={null}>
  {[-1,1].map(side=><group key={side} position={[side*5.8,-3.7,-1.5]} rotation={[0,side*-.22,0]}>
   <mesh geometry={resources.cylinder} material={resources.stone} scale={[2.1,.48,1.3]}/>
   <mesh geometry={resources.cylinder} material={resources.edge} position={[0,.26,0]} scale={[2.15,.045,1.34]}/>
   <mesh geometry={resources.cylinder} material={jewelry?resources.glass:resources.metal} position={[0,.3,0]} scale={[2.04,.025,1.25]}/>
   <mesh geometry={resources.box} material={resources.window} position={[0,.28,.99]} scale={[2.3,.015,.018]}/>
  </group>)}
 </group>;
});

/** The hero is only the far layer. Architecture and optional alpha plates occupy actual separate depths. */
export function LayeredEnvironment({asset,depth=-28,aspect,opacity=1,foreground=true,architecture=true,midgroundAsset,foregroundAsset,layers,variant,progress,paused,reducedMotion,quality}:LayeredEnvironmentProps){
 const resources=useMemo(()=>makeArchitectureResources(variant),[variant]),near=useRef<THREE.Group>(null),mid=useRef<THREE.Group>(null),{gl,size}=useThree();
 const low=quality==='low',wild=/ecosystem|forest/.test(variant),interior=/cuisine|food|atelier|costume|object|jewel|accessor|council|commons|clinic/.test(variant),kind=regionOf(variant);
 const cutouts=useMemo(()=>layers??[...(midgroundAsset?[{src:midgroundAsset,depth:-12,width:38,drift:-.55}]:[]),...(foregroundAsset?[{src:foregroundAsset,depth:-4,width:24,drift:-1.4}]:[])],[layers,midgroundAsset,foregroundAsset]);
 useEffect(()=>()=>resources.dispose(),[resources]);
 useFrame(()=>{
  const p=bound(progress),alpha=bound(opacity);
  for(const material of [resources.metal,resources.edge,resources.stone,resources.window]){material.opacity=alpha;material.depthWrite=alpha>=.9999;}resources.glass.opacity=.34*alpha;
  if(near.current){near.current.position.x=(p-.5)*-.85;near.current.position.z=ease(p)*.9;}
  if(mid.current){mid.current.position.x=(p-.5)*-.32;mid.current.position.z=ease(p)*.3;}
  if(foreground&&opacity>=.5){gl.domElement.dataset.environmentOpacity=alpha.toFixed(3);gl.domElement.dataset.environmentLayers=String(1+cutouts.length+(architecture&&!wild?2:0));gl.domElement.dataset.layerDepths=[depth,...cutouts.map(l=>l.depth??-12),...(architecture&&!wild?[-9,-2]:[])].join(',');gl.domElement.dataset.architectureRegion=kind;}
 });
 return <group>
  <ImageLayer src={asset} depth={depth} width={aspect?Math.max(64,36*aspect):64} position={[0,.8]} opacity={opacity} drift={.08} progress={progress} order={-10}/>
  {foreground?cutouts.map((layer,i)=><Suspense key={layer.src} fallback={null}><ImageLayer {...layer} progress={progress} opacity={(layer.opacity??1)*opacity} order={-5+i}/></Suspense>):null}
  {foreground&&architecture&&!wild?<group visible={opacity>.001} scale={[size.width<700?.7:1,1,1]}>
   <hemisphereLight args={[kind==='ice'?'#b9d3d9':'#e0c9a6','#14222c',.5]}/>
   <directionalLight position={[-8,9,9]} intensity={kind==='desert'?2:1.3} color={kind==='ice'?'#b3cdd6':'#f4d5ad'}/>
   <group ref={mid}>{!interior?kind==='market'?<MarketArcade resources={resources} low={low}/>:<SkylineArchitecture resources={resources} low={low} variant={variant}/>:null}</group>
   <group ref={near}>{interior?<ExhibitionLedges resources={resources} variant={variant}/>:kind==='market'?<MarketFabrics progress={progress} paused={paused} reducedMotion={reducedMotion} resources={resources} opacity={opacity}/>:null}</group>
  </group>:null}
 </group>;
}
