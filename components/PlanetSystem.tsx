'use client';

import { useEffect, useMemo, useRef } from 'react';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { regions } from '@/data/world';
import {crystalClusters} from '@/lib/planet-geology';

export interface PlanetSystemProps {
 orbitalProgress?: number;
  progress: number;
  paused: boolean;
  reducedMotion: boolean;
  selectedRegion: string | null;
  onSelectRegion: (id: string) => void;
}


const noiseGLSL = /* glsl */ `
  float hash31(vec3 p) {
    p = fract(p * .1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }
  float n3(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),
      mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),
      mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),
      mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  float fbm(vec3 p) {
    float result=0.0, gain=.5;
    mat3 r=mat3(.00,.80,.60,-.80,.36,-.48,-.60,-.48,.64);
    for(int i=0;i<5;i++) {
      result += gain*n3(p);
      p=r*p*2.03+vec3(6.4,1.7,9.2);
      gain*=.49;
    }
    return result;
  }
  // Warped three-dimensional mineral cells form unequal cratons, not Earth-like continents.
  vec3 mineralCells(vec3 q) {
    vec3 warp=vec3(fbm(q*1.7+4.0),fbm(q*1.7-6.0),fbm(q*1.7+12.0));
    vec3 p=q*vec3(3.7,2.6,4.3)+(warp-.5)*.88;
    vec3 cell=floor(p),local=fract(p);float first=9.0,second=9.0,identity=0.0;
    for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)for(int z=-1;z<=1;z++){
      vec3 offset=vec3(float(x),float(y),float(z)),seed=cell+offset;
      vec3 center=vec3(hash31(seed),hash31(seed+17.7),hash31(seed+43.1));
      float distance=length(offset+center-local);
      if(distance<first){second=first;first=distance;identity=hash31(seed+81.0);}else second=min(second,distance);
    }
    return vec3(second-first,identity,first);
  }
  float crustHeight(vec3 q,vec3 plate){
    return plate.y*.68+fbm(q*4.9+vec3(7.0,-3.0,2.0))*.25;
  }

`;

const surfaceVertex = /* glsl */ `
  ${noiseGLSL}
  varying vec3 vObject;
  varying vec3 vWorld;
  varying vec3 vNormalWorld;
  void main() {
    vec3 q=normalize(position);
    vec3 plate=mineralCells(q);float height=crustHeight(q,plate);
    float rock=smoothstep(.26,.32,height);
    float terraces=fbm(q*17.0);
    float ridges=pow(1.0-abs(fbm(q*29.0)*2.0-1.0),3.0);
    float depression=(1.0-smoothstep(.006,.045,plate.x))*.004;
    vec3 displaced=position+normal*(rock*(terraces*.006+ridges*.009)-depression);
    vObject=q;
    vWorld=(modelMatrix*vec4(displaced,1.0)).xyz;
    vNormalWorld=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.0);
  }
`;

const surfaceFragment = /* glsl */ `
  ${noiseGLSL}
  varying vec3 vObject;
  varying vec3 vWorld;
  varying vec3 vNormalWorld;
  uniform vec3 uStar;
  uniform float uOpacity;
  const float PI=3.141592653589793;
  float distribution(float NoH,float roughness) {
    float a=roughness*roughness, a2=a*a;
    float d=NoH*NoH*(a2-1.0)+1.0;
    return a2/max(PI*d*d,.0001);
  }
  void main() {
    vec3 q=normalize(vObject);
    vec3 plate=mineralCells(q);float h=crustHeight(q,plate);
    float land=smoothstep(.26,.32,h);
    float macro=fbm(q*21.0),micro=n3(q*1250.0);
    float crags=pow(1.0-abs(2.0*fbm(q*83.0)-1.0),4.0);
    float strata=.5+.5*sin(fbm(q*17.0)*93.0+plate.y*21.0);
    float bronze=smoothstep(.56,.79,plate.y)*smoothstep(.33,.65,macro);
    float crystal=smoothstep(.65,.80,macro)*smoothstep(.08,.22,plate.x);
    vec3 basalt=mix(vec3(.007,.014,.017),vec3(.020,.048,.043),macro*.65+crags*.3);
    basalt=mix(basalt,vec3(.063,.032,.013)*(.6+strata*.5),bronze*.7);
    basalt=mix(basalt,vec3(.028,.116,.109),crystal*.52);
    basalt*=.75+micro*.2+strata*.19;
    vec3 sea=mix(vec3(.001,.008,.011),vec3(.006,.048,.046),smoothstep(.12,.31,h));
    vec3 albedo=mix(sea,basalt,land);
    float polar=smoothstep(.77,.98,dot(q,normalize(vec3(-.28,1.0,.19)))+(macro-.5)*.18)*land;
    albedo=mix(albedo,vec3(.043,.128,.145)*(.65+crags*.45),polar*.72);
    float brokenRift=1.0-smoothstep(.008,.030,plate.x);
    albedo=mix(albedo,vec3(.002,.008,.010),brokenRift*.67);
    float roughness=mix(.34,.79,land);roughness=mix(roughness,.43,crystal*.55+bronze*.12);
    vec3 smoothN=normalize(vNormalWorld),geometricN=normalize(cross(dFdx(vWorld),dFdy(vWorld)));
    if(dot(geometricN,smoothN)<0.0)geometricN=-geometricN;
    vec3 N=normalize(mix(smoothN,geometricN,.16));
    vec3 tangent=normalize(cross(abs(N.y)>.95?vec3(1,0,0):vec3(0,1,0),N));
    vec3 bitangent=cross(N,tangent);
    float bumpA=n3(q*390.0)-n3(q*390.0+vec3(.19,0,0));
    float bumpB=n3(q*390.0)-n3(q*390.0+vec3(0,.19,0));
    N=normalize(N+(tangent*bumpA+bitangent*bumpB)*land*.09);
    vec3 L=normalize(uStar), V=normalize(cameraPosition-vWorld), H=normalize(L+V);
    float NoL=max(dot(N,L),0.0), NoV=max(dot(N,V),.001), NoH=max(dot(N,H),0.0), VoH=max(dot(V,H),0.0);
    vec3 F0=mix(vec3(.035),vec3(.155,.128,.080),bronze*.46+crystal*.1);
    vec3 F=F0+(1.0-F0)*pow(1.0-VoH,5.0);
    float k=pow(roughness+1.0,2.0)/8.0;
    float G=(NoV/(NoV*(1.0-k)+k))*(NoL/(NoL*(1.0-k)+k));
    vec3 spec=distribution(NoH,roughness)*G*F/max(4.0*NoV*NoL,.001);
    vec3 diffuse=albedo*(1.0-F)/PI;
    vec3 direct=(diffuse+spec)*NoL*vec3(4.1,3.6,2.85);
    float facing=dot(N,L);
    float night=1.0-smoothstep(-.19,.11,facing);
    float horizon=pow(1.0-NoV,3.0);
    vec3 ambient=albedo*vec3(.045,.075,.080);
    // Short, interrupted branching fractures follow mineral boundaries. No meridian or planar band.
    float fractureMask=smoothstep(.43,.65,fbm(q*8.3+vec3(8.0,-1.0,4.0)));
    float primary=(1.0-smoothstep(.0010,.007,plate.x))*fractureMask;
    float branch=(1.0-smoothstep(.0007,.0026,abs(fbm(q*47.0+plate.y)-.53)));
    branch*=smoothstep(.49,.65,fbm(q*15.0-7.0))*.24;
    float ancient=(primary*.38+branch)*land;
    vec3 emission=vec3(.91,.40,.10)*ancient*(.18+night*.72);
    // Inhabited shelves form unequal clusters, interlinked by darker industrial corridors.
    vec3 cell=floor(q*890.0);
    float settlements=step(.965,hash31(cell))*step(.50,n3(q*76.0));
    float industrial=step(.987,hash31(floor(q*610.0)+13.0));
    float coast=smoothstep(.26,.34,h)*(1.0-smoothstep(.44,.55,h));
    float habitable=1.0-smoothstep(.74,.92,abs(q.y));
    emission+=vec3(1.0,.58,.19)*settlements*coast*habitable*night*2.4;
    emission+=vec3(.11,.58,.52)*industrial*land*night*.85;
    vec3 rim=vec3(.025,.068,.060)*horizon*smoothstep(-.3,.3,facing);
    gl_FragColor=vec4(direct+ambient+emission+rim,uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const shellVertex = /* glsl */ `
  varying vec3 vObject;
  varying vec3 vWorld;
  varying vec3 vNormalWorld;
  void main() {
    vObject=normalize(position);
    vWorld=(modelMatrix*vec4(position,1.)).xyz;
    vNormalWorld=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
  }
`;
const cloudFragment = /* glsl */ `
  ${noiseGLSL}
  varying vec3 vObject;
  varying vec3 vWorld;
  varying vec3 vNormalWorld;
  uniform vec3 uStar;
  uniform float uTime;
  uniform float uOpacity;
  void main() {
    vec3 q=normalize(vObject);
    float drift=uTime*.0024;
    // A skewed circulation axis and isolated thin mineral aerosols, not blue-white cloud continents.
    float tilted=dot(q,normalize(vec3(.31,.91,-.27)));
    vec3 w=q*8.1+vec3(drift,drift*.15,-drift*.37);
    w.x+=sin(tilted*18.0+q.z*2.0)*.42;
    w.z+=sin(q.y*7.0+q.x*4.0)*.25;
    float belt=exp(-pow((tilted-.21)/.105,2.0))*.25;
    float second=exp(-pow((tilted+.50)/.067,2.0))*.16;
    vec2 storm=q.xz-vec2(-.40,.66);
    float radius=length(storm), angle=atan(storm.y,storm.x);
    float vortex=(.5+.5*sin(angle*3.0-radius*61.0))*exp(-radius*radius*43.0)*.19;
    float density=fbm(w)+fbm(w*3.1)*.12+belt+second+vortex;
    float alpha=smoothstep(.64,.86,density)*.22;
    float light=max(dot(normalize(vNormalWorld),normalize(uStar)),0.0);
    vec3 color=mix(vec3(.014,.035,.038),vec3(.19,.245,.205),light);
    float amber=smoothstep(.46,.66,fbm(q*3.7+vec3(2.3,4.7,1.0)));
    color=mix(color,vec3(.29,.205,.105)*(.32+light*.70),amber*.58);
    float edge=pow(1.-max(dot(normalize(vNormalWorld),normalize(cameraPosition-vWorld)),0.),3.0);
    color+=vec3(.075,.034,.11)*edge*.22;
    gl_FragColor=vec4(color*(.35+light*.9),alpha*uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
const atmosphereFragment = /* glsl */ `
  varying vec3 vObject;
  varying vec3 vWorld;
  varying vec3 vNormalWorld;
  uniform vec3 uStar;
  uniform float uOpacity;
  void main() {
    vec3 N=normalize(vNormalWorld), V=normalize(cameraPosition-vWorld), L=normalize(uStar);
    float edge=pow(1.0-abs(dot(N,V)),4.4);
    float sunlight=smoothstep(-.35,.6,dot(N,L));
    vec3 color=mix(vec3(.115,.055,.19),vec3(.23,.37,.27),sunlight);
    float starward=smoothstep(.18,.93,dot(N,L));
    color=mix(color,vec3(.86,.43,.12),starward*.77);
    gl_FragColor=vec4(color,edge*(.16+sunlight*.42)*uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function OrbitalStation({ paused, reducedMotion }: { paused: boolean; reducedMotion: boolean }) {
  const ring = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, delta) => { if (!paused && !reducedMotion && ring.current) { t.current += delta; ring.current.rotation.y = .25 + t.current * .035; } });
  return <group position={[2.72, .45, .65]} rotation={[.3, .25, -.46]} scale={.46}>
    <group ref={ring}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.83,.055,12,100]}/><meshStandardMaterial color="#68727c" metalness={.84} roughness={.44}/></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.70,.022,8,100]}/><meshStandardMaterial color="#353e49" metalness={.9} roughness={.4}/></mesh>
      {Array.from({length:24},(_,i)=>{const a=i/24*Math.PI*2;return <group key={i} position={[Math.cos(a)*.83,0,Math.sin(a)*.83]} rotation={[0,-a,0]}>
        <mesh><boxGeometry args={[.14,.11,.09]}/><meshStandardMaterial color={i%3===0?'#b69a6f':'#46505b'} metalness={.85} roughness={.5}/></mesh>
        <mesh position={[0,.063,0]}><boxGeometry args={[.075,.008,.034]}/><meshBasicMaterial color={i%4===0?'#7ee0ec':'#dfaf65'}/></mesh>
      </group>})}
      {Array.from({length:6},(_,i)=>i*Math.PI/3).map(a=><mesh key={a} rotation={[0,-a,0]} position={[Math.cos(a)*.4,0,Math.sin(a)*.4]}><boxGeometry args={[.73,.025,.027]}/><meshStandardMaterial color="#9a7952" metalness={.8} roughness={.4}/></mesh>)}
    </group>
    <mesh><cylinderGeometry args={[.16,.19,1.03,16]}/><meshStandardMaterial color="#596773" metalness={.85} roughness={.35}/></mesh>
    {[-.32,-.17,.18,.34].map(y=><mesh key={y} position={[0,y,0]}><cylinderGeometry args={[.22,.22,.065,24]}/><meshStandardMaterial color="#af9470" metalness={.85} roughness={.4}/></mesh>)}
    <mesh position={[0,.11,0]}><cylinderGeometry args={[.2,.2,.045,24]}/><meshBasicMaterial color="#72cbd6"/></mesh>
    <mesh position={[0,.65,0]}><cylinderGeometry args={[.012,.02,.36,8]}/><meshStandardMaterial color="#9d9d95" metalness={.7} roughness={.4}/></mesh>
    <mesh position={[0,.84,0]}><sphereGeometry args={[.018,8,8]}/><meshBasicMaterial color="#edc37b"/></mesh>
    {[-1,1].map(side=><group key={side} position={[side*.5,-.27,0]}>
      <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.012,.012,.8,6]}/><meshStandardMaterial color="#b6b4a9" metalness={.7} roughness={.4}/></mesh>
      <mesh position={[side*.15,0,0]} rotation={[.13,0,.03]}><boxGeometry args={[.43,.014,.34]}/><meshStandardMaterial color="#182d48" metalness={.7} roughness={.3}/></mesh>
      {Array.from({length:5},(_,i)=><mesh key={i} position={[side*.15, .009, -.14+i*.07]}><boxGeometry args={[.43,.004,.004]}/><meshStandardMaterial color="#59717f" metalness={.6} roughness={.5}/></mesh>)}
    </group>)}
    <mesh position={[.0,-.68,0]} rotation={[0,0,.2]}><coneGeometry args={[.15,.18,16,1,true]}/><meshStandardMaterial color="#667783" metalness={.8} roughness={.4} side={THREE.DoubleSide}/></mesh>
  </group>;
}

function Satellite({ index, paused, reducedMotion }: { index: number; paused: boolean; reducedMotion: boolean }) {
 const group=useRef<THREE.Group>(null), time=useRef(index*1.9);
 useFrame((_,dt)=>{if(!group.current)return;if(!paused&&!reducedMotion)time.current+=dt*.045;const a=time.current;group.current.position.set(Math.cos(a)*2.62,Math.sin(a*1.3)*.56-.3,Math.sin(a)*2.62);group.current.rotation.set(.3,a,.5);});
 if(index===0)return <group ref={group} scale={.11}>
  <mesh scale={[.4,.7,.4]}><sphereGeometry args={[1,32,24]}/><meshPhysicalMaterial color="#6d9e92" roughness={.32} metalness={.25} transmission={.3} thickness={.3}/></mesh>
  {[0,Math.PI/3,Math.PI*2/3].map(a=><mesh key={a} rotation={[.3,a,0]} scale={[.75,1.15,.55]}><torusGeometry args={[.8,.035,8,64]}/><meshStandardMaterial color="#7f9c81" metalness={.58} roughness={.4}/></mesh>)}
  <mesh><sphereGeometry args={[.18,20,16]}/><meshBasicMaterial color="#85bda4"/></mesh>
 </group>;
 return <group ref={group} scale={.11}>
  <mesh><boxGeometry args={[.4,.45,.4]}/><meshStandardMaterial color="#8e8778" metalness={.8} roughness={.45}/></mesh>
  <mesh><boxGeometry args={[2.4,.025,.38]}/><meshStandardMaterial color="#1b3653" metalness={.65} roughness={.35}/></mesh>
  <mesh position={[0,.38,0]}><cylinderGeometry args={[.015,.015,.5,6]}/><meshStandardMaterial color="#b4aaa0" metalness={.8} roughness={.4}/></mesh>
  <mesh position={[0,.61,0]}><sphereGeometry args={[.035,8,6]}/><meshBasicMaterial color="#9ce3eb"/></mesh>
 </group>;
}

const moonFragment = /* glsl */ `
 ${noiseGLSL}
 varying vec3 vObject;varying vec3 vWorld;varying vec3 vNormalWorld;
 void main(){
  vec3 q=normalize(vObject),N=normalize(vNormalWorld),L=normalize(vec3(-9.,5.,8.));
  float mineral=fbm(q*9.0),strata=.5+.5*sin(mineral*63.0+q.y*15.0);
  vec3 rock=mix(vec3(.018,.022,.024),vec3(.11,.095,.065),mineral*.7+strata*.25);
  float vein=1.-smoothstep(.0018,.009,abs(fbm(q*10.0+7.0)-.49));
  float facing=max(dot(N,L),0.0);vec3 V=normalize(cameraPosition-vWorld);
  float rim=pow(1.0-max(dot(N,V),0.0),4.0);
  vec3 color=rock*(.12+facing*1.65)+vec3(.72,.30,.055)*vein*.25+vec3(.025,.065,.053)*rim*.35;
  gl_FragColor=vec4(color,1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
 }
`;
const faultFaceVertex = /* glsl */ `
 varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
`;
const faultFaceFragment = /* glsl */ `
 varying vec2 vUv;
 void main(){
  vec2 p=vUv-.5;float r=length(p);
  float layers=.5+.5*sin(r*111.0+sin(p.x*19.0)*2.0);
  float branch=abs(p.x+.032*sin(p.y*43.0)+.046*sin(p.y*16.0));
  float fault=1.0-smoothstep(.001,.009,branch);
  float nodes=pow(max(0.0,sin(p.y*84.0)),15.0)*fault;
  vec3 rock=mix(vec3(.006,.012,.013),vec3(.052,.045,.026),layers*.45);
  gl_FragColor=vec4(rock+vec3(.94,.40,.075)*(fault*.68+nodes*.5),1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
 }
`;
function MineralCrystals(){
 const ref=useRef<THREE.InstancedMesh>(null),clusters=useMemo(()=>crystalClusters(),[]);
 useEffect(()=>{if(!ref.current)return;const dummy=new THREE.Object3D(),up=new THREE.Vector3(0,1,0);clusters.forEach((c,i)=>{const direction=new THREE.Vector3(...c.direction);dummy.position.copy(direction).multiplyScalar(2.018+c.height*.5);dummy.quaternion.setFromUnitVectors(up,direction);dummy.scale.set(c.width,c.height,c.width);dummy.updateMatrix();ref.current?.setMatrixAt(i,dummy.matrix);ref.current?.setColorAt(i,new THREE.Color(c.bronze?'#725435':'#244f50'));});ref.current.instanceMatrix.needsUpdate=true;if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;},[clusters]);
 return <instancedMesh ref={ref} args={[undefined,undefined,clusters.length]}><cylinderGeometry args={[.005,.014,1,5,1]}/><meshPhysicalMaterial color="#779491" metalness={.72} roughness={.29} clearcoat={.35} clearcoatRoughness={.25}/></instancedMesh>;
}
function SurfaceRelays(){
 // Short, terrain-aligned structures reinforce scale; the glowing network is embedded shader relief.
 const relays=useMemo(()=>Array.from({length:15},(_,i)=>{
  const a=i*2.3999,y=Math.sin(i*1.37)*.69,radial=Math.sqrt(1-y*y);
  const point=new THREE.Vector3(Math.cos(a)*radial,y,Math.sin(a)*radial).multiplyScalar(2.008);
  return {point,orientation:new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),point.clone().normalize())};
 }),[]);
 return <group>{relays.map((relay,i)=><group key={i} position={relay.point} quaternion={relay.orientation}>
  <mesh position={[0,.012,0]}><boxGeometry args={[.025,.035,.045]}/><meshStandardMaterial color="#333b36" metalness={.78} roughness={.53}/></mesh>
  <mesh position={[0,.031,.011]}><boxGeometry args={[.013,.003,.014]}/><meshBasicMaterial color={i%3===0?'#8ab6a1':'#dfaa61'}/></mesh>
 </group>)}</group>;
}

function BrokenMoon({progress}:{progress:number}) {
 const debris=useRef<THREE.Group>(null);
 useFrame(()=>{if(!debris.current)return;debris.current.children.forEach((mesh,i)=>{const a=i*2.399+progress*(.12+i*.003),r=.5+(i%5)*.06;mesh.position.set(Math.sin(a)*.12+.05,Math.cos(a)*r,Math.sin(a*1.3)*.25);mesh.rotation.set(a,a*.6+progress*.2,a*.7);});});
 const geometries=useMemo(()=>[Math.PI/2,-Math.PI/2].map(phi=>{
  const g=new THREE.SphereGeometry(.44,56,40,phi,Math.PI);const p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const d=1+Math.sin(x*38+y*21)*Math.cos(z*31)*.035+Math.sin(y*79-z*47)*.016;p.setXYZ(i,x*d,y*d,z*d);}
  g.computeVertexNormals();return g;
 }),[]);
 useEffect(()=>()=>geometries.forEach(g=>g.dispose()),[geometries]);
 return <group position={[-3.25,1.65,-3.0]} rotation={[.1,.2,.45]} scale={[1,.93,1.08]}>
  {/* Actual displaced hemispheres expose an open, fragmented fault. */}
  <group position={[.10,-.034,-.02]} rotation={[0,.075,-.12]}>
   <mesh geometry={geometries[0]}><shaderMaterial vertexShader={shellVertex} fragmentShader={moonFragment} side={THREE.DoubleSide}/></mesh>
   <mesh rotation={[0,Math.PI/2,0]}><circleGeometry args={[.425,48]}/><shaderMaterial vertexShader={faultFaceVertex} fragmentShader={faultFaceFragment} side={THREE.DoubleSide}/></mesh>
  </group>
  <group position={[-.055,.027,0]} rotation={[0,-.025,.035]}>
   <mesh geometry={geometries[1]}><shaderMaterial vertexShader={shellVertex} fragmentShader={moonFragment} side={THREE.DoubleSide}/></mesh>
   <mesh rotation={[0,Math.PI/2,0]}><circleGeometry args={[.425,48]}/><shaderMaterial vertexShader={faultFaceVertex} fragmentShader={faultFaceFragment} side={THREE.DoubleSide}/></mesh>
  </group>
  <group ref={debris}>{Array.from({length:16},(_,i)=>{const a=i*2.399;const r=.5+(i%5)*.06;return <mesh key={i} position={[Math.sin(a)*.12+.05,Math.cos(a)*r,Math.sin(a*1.3)*.25]} rotation={[a,a*.6,a*.7]}><dodecahedronGeometry args={[.018+(i%4)*.009,0]}/><meshStandardMaterial color="#50515a" roughness={.71} metalness={.31} emissive={i%5===0?'#a56623':'#000000'} emissiveIntensity={.18}/></mesh>})}</group>
 </group>;
}

export default function PlanetSystem({progress,paused,reducedMotion,selectedRegion,onSelectRegion,orbitalProgress=0}:PlanetSystemProps) {
 const rotation=useRef<THREE.Group>(null), clouds=useRef<THREE.Mesh>(null), surface=useRef<THREE.Mesh>(null!);
 const time=useRef(0), idle=useRef(.16), drag=useRef<{x:number;y:number;pitch:number;yaw:number}|null>(null);
 const manual=useRef(false), dragAngles=useRef({pitch:.1,yaw:.16});
 const {gl,size}=useThree();
 const star=useMemo(()=>new THREE.Vector3(-9,5,8),[]);
 const uniforms=useMemo(()=>({uStar:{value:star},uTime:{value:0},uOpacity:{value:1}}),[star]);
 const cloudUniforms=useMemo(()=>({uStar:{value:star},uTime:{value:0},uOpacity:{value:1}}),[star]);
 const atmosphereUniforms=useMemo(()=>({uStar:{value:star},uOpacity:{value:1}}),[star]);
 const target=useMemo(()=>new THREE.Quaternion(),[]), normal=useMemo(()=>new THREE.Vector3(),[]);
 const pickSphere=useMemo(()=>new THREE.Sphere(new THREE.Vector3(),2.02),[]), pickPoint=useMemo(()=>new THREE.Vector3(),[]);
 // Analytic sphere picking keeps three Html occlusion checks independent of mesh tessellation.
 const pickPlanet: THREE.Mesh['raycast']=(raycaster,intersections)=>{
  if(!surface.current)return;
  pickSphere.center.setFromMatrixPosition(surface.current.matrixWorld);
  pickSphere.radius=2.02*surface.current.matrixWorld.getMaxScaleOnAxis();
  if(!raycaster.ray.intersectSphere(pickSphere,pickPoint))return;
  const distance=raycaster.ray.origin.distanceTo(pickPoint);
  if(distance<raycaster.near||distance>raycaster.far)return;
  intersections.push({distance,point:pickPoint.clone(),object:surface.current});
 };
 const segments=size.width<700?128:256;
 useEffect(()=>{manual.current=false;},[selectedRegion]);
 useEffect(()=>{const initial=gl.domElement.style.touchAction;gl.domElement.style.touchAction='pan-y';return()=>{gl.domElement.style.touchAction=initial;};},[gl]);
 useFrame((_,dt)=>{
  if(!paused&&!reducedMotion)time.current+=Math.min(dt,.05);
  cloudUniforms.uTime.value=time.current;
  if(clouds.current)clouds.current.rotation.y=time.current*.007;
  if(!rotation.current)return;
  if(selectedRegion&&!manual.current){const region=regions.find(r=>r.id===selectedRegion);if(region){normal.set(...region.position).normalize();target.setFromUnitVectors(normal,new THREE.Vector3(0,.10,1).normalize());if(reducedMotion)rotation.current.quaternion.copy(target);else rotation.current.quaternion.slerp(target,1-Math.exp(-dt*3));}}
  else if(manual.current){if(!drag.current&&!paused&&!reducedMotion)dragAngles.current.yaw+=dt*.021;target.setFromEuler(new THREE.Euler(dragAngles.current.pitch,dragAngles.current.yaw,0,'YXZ'));if(reducedMotion)rotation.current.quaternion.copy(target);else rotation.current.quaternion.slerp(target,1-Math.exp(-dt*12));}
  else {if(!paused&&!reducedMotion)idle.current+=dt*.021;rotation.current.rotation.set(.1,idle.current,0);}
  gl.domElement.dataset.planetDesign='obsidian-cellular-v4';
  gl.domElement.dataset.rotation=[rotation.current.rotation.x,rotation.current.rotation.y,rotation.current.rotation.z].map(value=>value.toFixed(3)).join(',');
 });
 function pointerDown(e:ThreeEvent<PointerEvent>){if(progress>.25||e.nativeEvent.pointerType==='touch')return;e.stopPropagation();manual.current=true;const angles=new THREE.Euler().setFromQuaternion(rotation.current?.quaternion??new THREE.Quaternion(),'YXZ');dragAngles.current={pitch:angles.x,yaw:angles.y};drag.current={x:e.clientX,y:e.clientY,pitch:angles.x,yaw:angles.y};(e.target as unknown as {setPointerCapture:(id:number)=>void}).setPointerCapture(e.pointerId);gl.domElement.style.cursor='grabbing';}
 function pointerMove(e:ThreeEvent<PointerEvent>){if(!drag.current)return;e.stopPropagation();dragAngles.current={pitch:THREE.MathUtils.clamp(drag.current.pitch+(e.clientY-drag.current.y)*.004,-1.1,1.1),yaw:drag.current.yaw+(e.clientX-drag.current.x)*.005};}
 function pointerUp(e:ThreeEvent<PointerEvent>){drag.current=null;(e.target as unknown as {releasePointerCapture:(id:number)=>void}).releasePointerCapture(e.pointerId);gl.domElement.style.cursor='grab';}
 return <group>
  <group ref={rotation}>
   <mesh ref={surface} raycast={pickPlanet} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerOver={()=>{if(progress<.25)gl.domElement.style.cursor='grab';}} onPointerOut={()=>{if(!drag.current)gl.domElement.style.cursor='auto';}}>
    <sphereGeometry args={[2,segments,Math.round(segments*.67)]}/>
    <shaderMaterial vertexShader={surfaceVertex} fragmentShader={surfaceFragment} uniforms={uniforms}/>
   </mesh>
   <mesh ref={clouds} renderOrder={2}>
    <sphereGeometry args={[2.105,128,80]}/>
    <shaderMaterial vertexShader={shellVertex} fragmentShader={cloudFragment} uniforms={cloudUniforms} transparent depthWrite={false}/>
   </mesh>
   <MineralCrystals/>
   <SurfaceRelays/>
   {progress<.22&&regions.map(region=>{
    const point=new THREE.Vector3(...region.position).normalize().multiplyScalar(2.06);
    const orientation=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),point.clone().normalize());
    return <group key={region.id} position={point} quaternion={orientation}>
     <mesh onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();onSelectRegion(region.id);}}><sphereGeometry args={[.12,12,10]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>
     <mesh onClick={e=>{e.stopPropagation();onSelectRegion(region.id);}} onPointerOver={()=>{gl.domElement.style.cursor='pointer';}} onPointerOut={()=>{gl.domElement.style.cursor='auto';}}>
      <sphereGeometry args={[.027,12,10]}/><meshBasicMaterial color={region.color}/>
     </mesh>
     <mesh onClick={e=>{e.stopPropagation();onSelectRegion(region.id);}}>
      <torusGeometry args={[.065,.006,8,32]}/><meshBasicMaterial color={region.color} transparent opacity={selectedRegion === region.id ? .85 : .45}/>
     </mesh>
    </group>;
   })}
  </group>
  <mesh renderOrder={3}><sphereGeometry args={[2.16,128,80]}/><shaderMaterial vertexShader={shellVertex} fragmentShader={atmosphereFragment} uniforms={atmosphereUniforms} transparent depthWrite={false} side={THREE.BackSide} blending={THREE.AdditiveBlending}/></mesh>
  <group visible={progress<.43}><OrbitalStation paused={paused} reducedMotion={reducedMotion}/>
  {[0,1,2].map(index=><Satellite key={index} index={index} paused={paused} reducedMotion={reducedMotion}/>)}
  <BrokenMoon progress={orbitalProgress}/></group>
 </group>;
}
