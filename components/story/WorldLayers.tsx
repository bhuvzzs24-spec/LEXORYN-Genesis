'use client';

import { memo, useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {LayeredEnvironment} from './LayeredEnvironment';
import * as THREE from 'three';

/** Local progress is authoritative: every vehicle/mechanism reverses with the scroll. */
export interface WorldLayerProps {
  progress: number;
  globalProgress?: number;
  paused: boolean;
  reducedMotion: boolean;
  quality: 'high' | 'low';
  variant: string;
  seed?: number;
}
export interface ParallaxEnvironmentProps extends WorldLayerProps {
  asset: string;
  depth?: number;
  aspect?: number;
  opacity?: number;
  foreground?: boolean;
}
export type VehicleVariant = 'fleet' | 'scout' | 'train' | 'bike' | 'cargo' | 'skimmer' | 'crawler' | 'none';
export type EnvironmentVariant = 'city' | 'market' | 'desert' | 'ice' | 'storm' | 'culture' | 'festival';

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t); };
function random(seed: number) {
  let state = seed >>> 0;
  return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
}
function climate(variant: string) {
  if (/desert|pyravar|solar|heat|skimmer/.test(variant)) return 'desert';
  if (/ice|cryo|polar|glacier|crawler/.test(variant)) return 'ice';
  if (/market|food|kitchen|cuisine/.test(variant)) return 'market';
  if (/festival|convergence/.test(variant)) return 'festival';
  if (/storm|meridia/.test(variant)) return 'storm';
  return 'city';
}
const palettes = {
  city: { metal: '#27323d', bronze: '#977042', light: '#6fdce6', haze: '#64828f' },
  desert: { metal: '#302b28', bronze: '#ab8148', light: '#edbc70', haze: '#b69465' },
  ice: { metal: '#354653', bronze: '#778c98', light: '#8bd5ed', haze: '#839eab' },
  market: { metal: '#322e29', bronze: '#b08a4b', light: '#ebbf79', haze: '#b3946c' },
  festival: { metal: '#272b37', bronze: '#b58a50', light: '#f4c37a', haze: '#647b92' },
  storm: { metal: '#253642', bronze: '#8f714d', light: '#59dbe7', haze: '#4d6c82' },
};

/** Backward-compatible entry into the shared layered environment. */
export function ParallaxEnvironment(props:ParallaxEnvironmentProps){return <LayeredEnvironment {...props}/>;}

function createVehicleResources() {
  const profile = new THREE.Shape();
  profile.moveTo(1.72, 0); profile.lineTo(.72, .42); profile.lineTo(-1.25, .38); profile.lineTo(-1.62, .16); profile.lineTo(-1.62, -.16); profile.lineTo(-1.25, -.38); profile.lineTo(.72, -.42); profile.closePath();
  const wing = new THREE.Shape(); wing.moveTo(.7, 0); wing.lineTo(-.65, 1.15); wing.lineTo(-1.05, 1.1); wing.lineTo(-.65, 0); wing.closePath();
  const geometries = {
    hull: new THREE.ExtrudeGeometry(profile, { depth: .23, bevelEnabled: true, bevelSize: .065, bevelThickness: .065, bevelSegments: 2, steps: 1 }),
    wing: new THREE.ExtrudeGeometry(wing, { depth: .035, bevelEnabled: true, bevelSize: .018, bevelThickness: .018, bevelSegments: 1 }),
    box: new THREE.BoxGeometry(1, 1, 1), sphere: new THREE.SphereGeometry(1, 20, 12),
    tube: new THREE.CylinderGeometry(1, 1, 1, 16), disk: new THREE.CylinderGeometry(1, 1, .035, 16),
    wheel: new THREE.TorusGeometry(.31, .052, 8, 32), wheelLight: new THREE.TorusGeometry(.265, .012, 6, 32),
  };
  const materials = {
    hull: new THREE.MeshStandardMaterial({ color: '#424c56', metalness: .82, roughness: .36 }),
    dark: new THREE.MeshStandardMaterial({ color: '#17212b', metalness: .72, roughness: .39 }),
    bronze: new THREE.MeshStandardMaterial({ color: '#a17b4e', metalness: .82, roughness: .44 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#102530', metalness: .68, roughness: .12, clearcoat: .8 }),
    engine: new THREE.MeshStandardMaterial({ color: '#7bdce8', emissive: '#59dbe7', emissiveIntensity: 1.5, metalness: .3, roughness: .25 }),
    warm: new THREE.MeshStandardMaterial({ color: '#dfb47c', emissive: '#c99858', emissiveIntensity: .35, metalness: .5, roughness: .4 }),
  };
  return { geometries, materials, dispose() { Object.values(geometries).forEach(g => g.dispose()); Object.values(materials).forEach(m => m.dispose()); } };
}
type VehicleResources = ReturnType<typeof createVehicleResources>;

const CraftModel=memo(function CraftModel({ type, resources, detailed }: { type: string; resources: VehicleResources; detailed: boolean }) {
  const { geometries: g, materials: m } = resources;
  const cargo = type === 'cargo', bike = type === 'bike', ground = type === 'crawler', skimmer = type === 'skimmer';
  return <group dispose={null} scale={bike ? [.68, .75, .48] : ground ? [1.05, .82, .9] : [1, 1, 1]}>
    <mesh geometry={g.hull} material={ground ? m.dark : m.hull} rotation={[-Math.PI / 2, 0, 0]} position={[0, -.13, 0]}/>
    <mesh geometry={g.sphere} material={m.glass} position={[.52, .28, 0]} scale={[.59, .24, .31]}/>
    <mesh geometry={g.box} material={m.bronze} position={[.0, .035, 0]} scale={[1.35, .035, .69]}/>
    <mesh geometry={g.box} material={m.dark} position={[-.62, .16, 0]} scale={[.65, .17, .5]}/>
    {[-1, 1].map(side => <group key={side}>
      <mesh geometry={g.wing} material={m.dark} rotation={[-Math.PI / 2, 0, side < 0 ? Math.PI : 0]} position={[-.3, -.06, side * .28]} scale={[1, bike ? .4 : 1, 1]}/>
      <mesh geometry={g.tube} material={m.dark} position={[-.8, -.13, side * (bike ? .48 : .67)]} rotation={[0, 0, Math.PI / 2]} scale={[.14, .66, .14]}/>
      <mesh geometry={g.disk} material={m.engine} position={[-1.145, -.13, side * (bike ? .48 : .67)]} rotation={[0, 0, Math.PI / 2]} scale={[.105, 1, .105]}/>
      <mesh geometry={g.box} material={m.bronze} position={[-.37, -.02, side * .35]} scale={[1.05, .025, .035]}/>
      {detailed ? [-.7, -.5, -.3].map(x => <mesh key={x} geometry={g.box} material={m.bronze} position={[x, .27, side * .22]} scale={[.055, .015, .12]}/>) : null}
    </group>)}
    {cargo ? <group position={[-.35, .45, 0]}>
      <mesh geometry={g.box} material={m.dark} scale={[1.4, .54, .72]}/>
      {[-.75, -.2, .35].map(x => <mesh key={x} geometry={g.box} material={m.bronze} position={[x, 0, 0]} scale={[.035, .56, .75]}/>)}
      <mesh geometry={g.box} material={m.warm} position={[.68, 0, .365]} scale={[.018, .2, .018]}/>
    </group> : null}
    {bike ? <group>{[-.94, .94].map(x => <group key={x} position={[x, -.20, 0]}><mesh geometry={g.wheel} material={m.dark}/><mesh geometry={g.wheelLight} material={m.engine}/><mesh geometry={g.tube} material={m.bronze} rotation={[Math.PI / 2, 0, 0]} scale={[.08, .28, .08]}/></group>)}<mesh geometry={g.box} material={m.dark} position={[-.2, .34, 0]} scale={[.65, .12, .32]}/><mesh geometry={g.box} material={m.bronze} position={[.5, .44, 0]} scale={[.05, .06, .59]}/></group> : null}
    {ground ? [-1, 1].map(side => <group key={side} position={[0, -.34, side * .48]}>
      <mesh geometry={g.box} material={m.dark} scale={[2.5, .27, .28]}/>
      {[-.95, -.48, 0, .48, .95].map(x => <mesh key={x} geometry={g.tube} material={m.bronze} position={[x, 0, side * .1]} rotation={[Math.PI / 2, 0, 0]} scale={[.19, .11, .19]}/>)}
      <mesh geometry={g.box} material={m.warm} position={[1.25, .21, 0]} scale={[.025, .12, .2]}/>
    </group>) : null}
    {skimmer ? [-1, 1].map(side => <mesh key={side} geometry={g.box} material={m.bronze} position={[-.15, -.4, side * .54]} rotation={[0, 0, -.04]} scale={[2.65, .045, .16]}/>) : null}
  </group>;
});

const TrainModel=memo(function TrainModel({ resources, count }: { resources: VehicleResources; count: number }) {
  const { geometries: g, materials: m } = resources;
  return <group dispose={null}>
    {Array.from({ length: count }, (_, i) => <group key={i} position={[-i * 2.28, 0, 0]}>
      <mesh geometry={g.box} material={m.hull} scale={[2.12, .65, .72]}/>
      <mesh geometry={g.box} material={m.dark} position={[0, .07, .37]} scale={[1.95, .36, .025]}/>
      <mesh geometry={g.box} material={m.dark} position={[0, .07, -.37]} scale={[1.95, .36, .025]}/>
      <mesh geometry={g.box} material={m.engine} position={[0, -.27, .385]} scale={[2.0, .022, .015]}/>
      {[-.63, 0, .63].map(x => <mesh key={x} geometry={g.box} material={m.bronze} position={[x, .09, .39]} scale={[.028, .4, .016]}/>)}
      {i === 0 ? <mesh geometry={g.sphere} material={m.glass} position={[1.04, .07, 0]} scale={[.38, .28, .34]}/> : null}
    </group>)}
  </group>;
});

interface VehicleFlight {a:number[];b:number[];scale:number;type:string;distant?:boolean;}
const DistantCraft=memo(function DistantCraft({resources,cargo}:{resources:VehicleResources;cargo:boolean}){
 const {geometries:g,materials:m}=resources;
 return <group dispose={null}>
  <mesh geometry={g.hull} material={m.dark} rotation={[-Math.PI/2,0,0]} scale={[1,cargo?1.4:1,1]}/>
  <mesh geometry={g.sphere} material={m.glass} position={[.55,.17,0]} scale={[.5,.2,.3]}/>
  <mesh geometry={g.box} material={m.bronze} position={[-.2,.07,0]} scale={[1.7,.035,.42]}/>
  {[-1,1].map(side=><group key={side}>
   <mesh geometry={g.wing} material={m.hull} rotation={[-Math.PI/2,0,side<0?Math.PI:0]} position={[-.35,0,side*.27]} scale={[.7,.75,.7]}/>
   <mesh geometry={g.disk} material={m.engine} position={[-1.16,.02,side*.39]} rotation={[0,0,Math.PI/2]} scale={[.08,1,.08]}/>
  </group>)}
 </group>;
});
export function AnimatedVehicleLayer({progress,paused,reducedMotion,quality,variant,seed=3186}:WorldLayerProps){
 const resources=useMemo(createVehicleResources,[]),vehicles=useRef<(THREE.Group|null)[]>([]),clock=useRef(0),{gl}=useThree();
 const paths=useMemo<VehicleFlight[]>(()=>{
  if(variant==='none')return [];
  let primary:VehicleFlight[];
  if(variant==='fleet')primary=[
   {a:[-16,-.4,4],b:[17,2.1,-3],scale:.68,type:'scout'},
   {a:[15,3,-9],b:[-17,1.4,-11],scale:.34,type:'scout'},
   {a:[-9,5,-13],b:[8,3,-8],scale:.23,type:'cargo'},
  ];
  else if(variant==='train')primary=[{a:[-17,-1.7,-3],b:[24,-1.7,-3],scale:.64,type:'train'}];
  else if(variant==='crawler')primary=[{a:[-13,-3,-2],b:[14,-2.8,-4],scale:.6,type:'crawler'}];
  else if(variant==='skimmer')primary=[{a:[-14,-2.4,-1],b:[15,-1.9,-5],scale:.62,type:'skimmer'}];
  else if(variant==='bike')primary=[{a:[-14,-.3,3.2],b:[15,1.2,-2],scale:.72,type:'bike'},{a:[16,2,-7],b:[-16,1.5,-9],scale:.32,type:'bike'}];
  else if(variant==='cargo')primary=[{a:[-15,.4,-2],b:[16,2.5,-7],scale:.58,type:'cargo'},{a:[15,3.2,-12],b:[-14,1.3,-10],scale:.3,type:'cargo'}];
  else primary=[{a:[-14,-.3,3],b:[16,1.5,-4],scale:.68,type:'scout'},{a:[15,2.6,-9],b:[-14,1.6,-10],scale:.25,type:'scout'}];
  const frontier=variant==='crawler'||variant==='skimmer',count=quality==='low'?(frontier?1:3):(frontier?3:10),r=random(seed+variant.length*81);
  const traffic=Array.from({length:count},(_,i)=>{
   const direction=i%2?-1:1,start=-15+r()*10,y=1.2+(i%4)*.88+r()*.4,z=-12-(i%5)*2.7;
   return {a:[start*direction,y,z],b:[(14+r()*7)*direction,y+(r()-.5)*1.7,z+(r()-.5)*3],scale:.08+r()*.11,type:i%4===0?'cargo':'scout',distant:true};
  });
  return [...primary,...traffic];
 },[variant,quality,seed]);
 const direction=useMemo(()=>new THREE.Vector3(),[]),forward=useMemo(()=>new THREE.Vector3(1,0,0),[]);
 useEffect(()=>()=>resources.dispose(),[resources]);
 useFrame((_,dt)=>{
  if(!paused&&!reducedMotion)clock.current+=Math.min(dt,.05);
  const p=clamp(progress);
  paths.forEach((path,i)=>{
   const craft=vehicles.current[i];if(!craft)return;
   const delay=path.distant?0:i*.025,t=smooth(clamp((p-delay)/(1-delay))),rise=path.type==='crawler'||path.type==='train'?0:path.distant?.16:.5;
   craft.position.set(THREE.MathUtils.lerp(path.a[0],path.b[0],t),THREE.MathUtils.lerp(path.a[1],path.b[1],t)+Math.sin(t*Math.PI)*rise,THREE.MathUtils.lerp(path.a[2],path.b[2],t));
   direction.set(path.b[0]-path.a[0],path.b[1]-path.a[1]+Math.cos(t*Math.PI)*Math.PI*rise,path.b[2]-path.a[2]).normalize();
   craft.quaternion.setFromUnitVectors(forward,direction);craft.rotateX(Math.sin(t*Math.PI*2+i)*.035);
  });
  resources.materials.engine.emissiveIntensity=1.2+Math.sin(clock.current*1.4+seed)*.08;
  if(paths.length&&vehicles.current[0])gl.domElement.dataset.vehiclePosition=vehicles.current[0].position.toArray().map(v=>v.toFixed(3)).join(',');
  gl.domElement.dataset.vehicleProgress=p.toFixed(3);gl.domElement.dataset.trafficCount=String(paths.length);gl.domElement.dataset.trafficDepthBands=String(new Set(paths.map(p=>Math.round(p.a[2]/4))).size);
 });
 const composition=useMemo(()=><group>
  {paths.map((path,i)=><group key={`${variant}-${i}`} ref={node=>{vehicles.current[i]=node;}} scale={path.scale}>
   {path.type==='train'?<TrainModel resources={resources} count={quality==='low'?3:6}/>:path.distant?<DistantCraft resources={resources} cargo={path.type==='cargo'}/>:<CraftModel type={path.type} resources={resources} detailed={quality==='high'&&i<2}/>}
  </group>)}
  {variant==='train'?<group position={[0,-2.17,-3]} dispose={null}>
   <mesh geometry={resources.geometries.box} material={resources.materials.dark} scale={[42,.12,.5]}/>
   {[-.25,.25].map(z=><mesh key={z} geometry={resources.geometries.box} material={resources.materials.bronze} position={[0,.1,z]} scale={[42,.025,.035]}/>)}
  </group>:null}
 </group>,[paths,resources,quality,variant]);
 return variant==='none'?null:composition;
}

const atmosphereVertex = /* glsl */ `
  uniform float uProgress; uniform float uTime; uniform float uKind;
  attribute float aSeed;
  varying float vAlpha; varying float vSeed;
  void main(){
    vec3 p=position;float drift=uProgress*8.0+uTime*.09;
    if(uKind>1.5){p.y=mod(p.y-drift*3.1+12.0,24.0)-12.0;p.x+=sin(aSeed*12.0+uProgress*6.0)*.25;}
    else if(uKind>.5){p.y=mod(p.y-drift*.65+12.0,24.0)-12.0;p.x+=sin(aSeed*20.0+uTime*.1+uProgress*4.0)*.7;}
    else{p.x=mod(p.x+drift+22.0,44.0)-22.0;p.y+=sin(aSeed*20.0+uProgress*5.0+uTime*.12)*.18;}
    vec4 view=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*view;
    gl_PointSize=clamp((uKind>1.5?14.0:10.0)/max(1.0,-view.z),.7,uKind>.5?3.2:2.1);
    vAlpha=.18+aSeed*.45;vSeed=aSeed;
  }
`;
const atmosphereFragment = /* glsl */ `
 uniform vec3 uColor;uniform float uKind;varying float vAlpha;varying float vSeed;
 void main(){vec2 p=gl_PointCoord-.5;p.x*=uKind>1.5?3.0:1.0;float a=(1.0-smoothstep(.05,.5,length(p)))*vAlpha;gl_FragColor=vec4(uColor,a);}
`;
const vaporVertex = /* glsl */ `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const vaporFragment = /* glsl */ `
 varying vec2 vUv;uniform float uTime;uniform float uProgress;uniform float uSeed;uniform float uOpacity;uniform vec3 uColor;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
 float fbm(vec2 p){float a=.5,n=0.;for(int i=0;i<5;i++){n+=noise(p)*a;p=p*2.1+3.7;a*=.5;}return n;}
 void main(){vec2 p=vUv;vec2 flow=vec2(uTime*(.007+uSeed*.0005)+uProgress*(.19+uSeed*.035),-uTime*.003-uProgress*(.06+uSeed*.012));float n=fbm(p*vec2(6.,4.)+flow+uSeed);float mask=smoothstep(0.,.15,p.x)*smoothstep(0.,.15,1.-p.x)*smoothstep(0.,.2,p.y)*smoothstep(0.,.2,1.-p.y);float a=smoothstep(.34,.78,n)*mask*uOpacity;gl_FragColor=vec4(uColor*(.7+n*.35),a);}
`;
function VaporPlane({ index, progress, clock, variant }: { index: number; progress: number; clock: RefObject<number>; variant: string }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const mist = climate(variant), steam = mist === 'market';
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uProgress: { value: 0 }, uSeed: { value: index * 2.37 }, uOpacity: { value: steam ? .17 : mist === 'desert' ? .065 : index===0?.085:.13 }, uColor: { value: new THREE.Color(palettes[mist].haze) } }), [index, mist, steam]);
  useFrame(() => { if (material.current) { material.current.uniforms.uTime.value = clock.current; material.current.uniforms.uProgress.value = progress; } });
  return <mesh position={[steam ? (index === 0 ? -4 : 4.5) : (index - 1) * 2, steam ? -.8 : -1 + index * .7, -11 + index * 4]} rotation={[0, 0, index * .045]}>
    <planeGeometry args={steam ? [7, 8] : [35, 17]}/><shaderMaterial ref={material} uniforms={uniforms} vertexShader={vaporVertex} fragmentShader={vaporFragment} transparent depthWrite={false} side={THREE.DoubleSide}/>
  </mesh>;
}
const auroraVertex = /* glsl */ `uniform float uProgress;uniform float uTime;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z+=sin(p.x*.28+uProgress*4.+uTime*.06)*1.3;p.y+=sin(p.x*.43+uProgress*2.)*.7;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const auroraFragment = /* glsl */ `varying vec2 vUv;uniform float uProgress;void main(){float strands=.55+.45*sin(vUv.x*180.+sin(vUv.x*25.)*5.);float edge=sin(vUv.x*3.14159);float alpha=pow(1.-vUv.y,1.8)*smoothstep(0.,.12,vUv.y)*strands*edge*.22;vec3 col=mix(vec3(.18,.68,.60),vec3(.29,.26,.62),vUv.y);gl_FragColor=vec4(col,alpha);}`;
function Aurora({ progress, clock }: { progress: number; clock: RefObject<number> }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uProgress: { value: 0 }, uTime: { value: 0 } }), []);
  useFrame(() => { if (material.current) { material.current.uniforms.uProgress.value = progress; material.current.uniforms.uTime.value = clock.current; } });
  return <mesh position={[0, 5.3, -12]}><planeGeometry args={[36, 6, 72, 8]}/><shaderMaterial ref={material} uniforms={uniforms} vertexShader={auroraVertex} fragmentShader={auroraFragment} transparent depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending}/></mesh>;
}
function Lightning({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) {
  const line = useRef<THREE.LineSegments>(null), light = useRef<THREE.PointLight>(null);
  const geometry = useMemo(() => {
    const r = random(702), points: number[] = []; let x = 5.3, y = 9;
    for (let i = 0; i < 18; i++) { const nx = x + (r() - .5) * 1.3, ny = y - .7; points.push(x, y, -13, nx, ny, -13); x = nx; y = ny; }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(() => {
    const intensity = reducedMotion ? 0 : Math.exp(-Math.pow((progress - .34) / .012, 2)) + Math.exp(-Math.pow((progress - .73) / .018, 2)) * .65;
    if (line.current) (line.current.material as THREE.LineBasicMaterial).opacity = intensity * .7;
    if (light.current) light.current.intensity = intensity * 1.6;
  });
  return <group><lineSegments ref={line} geometry={geometry}><lineBasicMaterial color="#afdcf4" transparent opacity={0}/></lineSegments><pointLight ref={light} position={[4, 5, -7]} color="#9fd2ed" intensity={0} distance={24}/></group>;
}

export function AtmosphericEffects({ progress, paused, reducedMotion, quality, variant, seed = 3186 }: WorldLayerProps) {
  const clock = useRef(0), material = useRef<THREE.ShaderMaterial>(null);
  const kind = climate(variant), count = quality === 'low' ? 200 : kind === 'ice' || kind === 'storm' ? 950 : 560;
  const geometry = useMemo(() => {
    const r = random(seed), positions = new Float32Array(count * 3), seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) { positions.set([(r() - .5) * 44, (r() - .5) * 24, -12 + r() * 18], i * 3); seeds[i] = r(); }
    return new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3)).setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  }, [count, seed]);
  const uniforms = useMemo(() => ({ uProgress: { value: 0 }, uTime: { value: 0 }, uKind: { value: kind === 'storm' ? 2 : kind === 'ice' ? 1 : 0 }, uColor: { value: new THREE.Color(kind === 'desert' ? '#dfbf8a' : kind === 'ice' ? '#d4e8ed' : '#9ab8c5') } }), [kind]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, dt) => { if (!paused && !reducedMotion) clock.current += Math.min(dt, .05); if (material.current) { material.current.uniforms.uTime.value = clock.current; material.current.uniforms.uProgress.value = clamp(progress); } });
  return <group>
    <points geometry={geometry} frustumCulled={false}><shaderMaterial ref={material} uniforms={uniforms} vertexShader={atmosphereVertex} fragmentShader={atmosphereFragment} transparent depthWrite={false}/></points>
    {Array.from({ length: quality === 'low' ? 2 : 4 }, (_, i) => <VaporPlane key={i} index={i} progress={progress} clock={clock} variant={variant}/>)}
    {kind === 'ice' ? <Aurora progress={progress} clock={clock}/> : null}
    {kind === 'storm' ? <Lightning progress={progress} reducedMotion={reducedMotion}/> : null}
  </group>;
}

export function CivicMechanisms({ progress, variant, quality }: WorldLayerProps) {
  const rotating = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const pulses = useRef<(THREE.Mesh | null)[]>([]);
  const count = variant === 'energy' ? 5 : 3;
  const routes = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const side = i % 2 ? -1 : 1;
    return new THREE.CatmullRomCurve3([new THREE.Vector3(side * 7, -2.7 + i * .3, -9), new THREE.Vector3(side * 3, 1.2 + i * .25, -8), new THREE.Vector3(-side * 1.8, .4 + i * .35, -10)]);
  }), []);
  const lineGeometry = useMemo(() => routes.map(route => new THREE.BufferGeometry().setFromPoints(route.getPoints(48))), [routes]);
  useEffect(() => () => lineGeometry.forEach(g => g.dispose()), [lineGeometry]);
  useFrame(() => {
    if (rotating.current) rotating.current.rotation.z = progress * Math.PI * (variant === 'transit' ? .5 : 1.3);
    rings.current.forEach((ring, i) => { if (!ring) return; ring.rotation.z = (i % 2 ? -1 : 1) * progress * Math.PI * .7; const mat = ring.material as THREE.MeshStandardMaterial; mat.emissiveIntensity = .1 + smooth((progress - i * .12) * 3) * .9; });
    pulses.current.forEach((pulse, i) => { if (pulse) pulse.position.copy(routes[i].getPoint(clamp(progress * 1.3 - i * .06))); });
  });
  if (variant === 'none') return null;
  if (variant === 'network') return <group>
    {lineGeometry.map((geometry, i) => <group key={i}><lineSegments geometry={geometry}><lineBasicMaterial color="#6bb7c4" transparent opacity={.25}/></lineSegments><mesh ref={node => { pulses.current[i] = node; }}><sphereGeometry args={[.045, 10, 8]}/><meshBasicMaterial color={i % 2 ? '#edc58b' : '#82d8e4'}/></mesh></group>)}
  </group>;
  const clinical = variant === 'clinic', council = variant === 'council';
  const x = clinical ? 4.7 : council ? 0 : 4.8, y = clinical ? -.4 : council ? -1.9 : 1;
  const scale = clinical ? .55 : council ? .7 : 1;
  return <group position={[x, y, -7]} scale={scale}>
    <group ref={rotating}>
      {Array.from({ length: count }, (_, i) => <mesh key={i} ref={node => { rings.current[i] = node; }} position={[0, 0, i * -.18]} rotation={[0, i * .035, 0]}><torusGeometry args={[1.3 + i * .26, .026, 8, quality === 'low' ? 48 : 96]}/><meshStandardMaterial color={i % 2 ? '#8e724b' : '#3a505d'} emissive={i % 2 ? '#866338' : '#397b89'} emissiveIntensity={.2} metalness={.8} roughness={.4}/></mesh>)}
      {Array.from({ length: quality === 'low' ? 6 : 10 }, (_, i) => { const a = i / (quality === 'low' ? 6 : 10) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 2, Math.sin(a) * 2, -.3]} rotation={[0, 0, a]}><boxGeometry args={[.36, .09, .12]}/><meshStandardMaterial color="#9b7a50" metalness={.86} roughness={.45}/></mesh>; })}
    </group>
    <mesh position={[0, -2.7, -.4]}><cylinderGeometry args={[.23, .35, 2.2, 12]}/><meshStandardMaterial color="#293743" metalness={.8} roughness={.48}/></mesh>
    <mesh position={[0, -3.9, -.4]}><cylinderGeometry args={[1.4, 1.65, .25, 32]}/><meshStandardMaterial color="#3b4148" metalness={.73} roughness={.5}/></mesh>
    {clinical ? <mesh position={[0, 0, .1]}><planeGeometry args={[1.1, 1.7]}/><meshPhysicalMaterial color="#66b3c6" transparent opacity={.18} metalness={.3} roughness={.25} side={THREE.DoubleSide}/></mesh> : null}
  </group>;
}

/** Two instanced draw calls; launch and ascent are scrubbed, never a static light count. */
export function FestivalDrones({ progress, paused, reducedMotion, quality, seed = 3186 }: WorldLayerProps) {
  const frames = useRef<THREE.InstancedMesh>(null), cores = useRef<THREE.InstancedMesh>(null);
  const clock = useRef(0), count = quality === 'low' ? 640 : 2400;
  const { gl } = useThree();
  const particles = useMemo(() => { const r = random(seed); return Array.from({ length: count }, () => ({ x: (r() - .5) * 40, z: -16 + r() * 14, launch: r() * .63, rise: 10 + r() * 12, drift: (r() - .5) * 3.5, size: .018 + r() * .027, phase: r() * Math.PI * 2 })); }, [count, seed]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((_, dt) => {
    if (!frames.current || !cores.current) return;
    if (!paused && !reducedMotion) clock.current += Math.min(dt, .05);
    let launched = 0;
    particles.forEach((p, i) => {
      const rise = smooth(clamp((progress - p.launch) / Math.max(.2, 1 - p.launch)));
      if (rise > 0) launched++;
      dummy.position.set(p.x + p.drift * rise + Math.sin(p.phase + clock.current * .17) * .06, -8 + rise * p.rise, p.z - rise * 1.5);
      dummy.rotation.set(.1, p.phase + progress * .7, Math.sin(p.phase + clock.current * .12) * .045);
      dummy.scale.set(p.size * 1.6, p.size * 2.1, p.size * 1.6); dummy.updateMatrix(); frames.current?.setMatrixAt(i, dummy.matrix);
      dummy.scale.setScalar(p.size * .85); dummy.updateMatrix(); cores.current?.setMatrixAt(i, dummy.matrix);
    });
    frames.current.instanceMatrix.needsUpdate = true; cores.current.instanceMatrix.needsUpdate = true;
    gl.domElement.dataset.festivalCount = String(count); gl.domElement.dataset.festivalLaunched = String(launched); gl.domElement.dataset.festivalProgress = clamp(progress).toFixed(3);
  });
  return <group>
    <instancedMesh ref={frames} args={[undefined, undefined, count]} frustumCulled={false}><boxGeometry args={[1, 1, 1]}/><meshStandardMaterial color="#8d6a3e" emissive="#7a5329" emissiveIntensity={.13} metalness={.8} roughness={.48} transparent opacity={.68}/></instancedMesh>
    <instancedMesh ref={cores} args={[undefined, undefined, count]} frustumCulled={false}><sphereGeometry args={[1, 6, 4]}/><meshBasicMaterial color="#f4c37a" toneMapped={false}/></instancedMesh>
  </group>;
}
