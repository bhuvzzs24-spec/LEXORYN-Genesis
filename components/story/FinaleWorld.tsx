'use client';
import {Suspense,useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useCinematicTexture} from './useCinematicTexture';
import * as THREE from 'three';
import {characters,type CharacterDefinition} from '@/data/characters';

function CastPlane({character,x=0,height=7.3,z=-1,progress}:{character:CharacterDefinition;x?:number;height?:number;z?:number;progress:number}){
 const base=useCinematicTexture(character.asset),group=useRef<THREE.Group>(null),{gl}=useThree();
 const texture=useMemo(()=>{const t=base.clone();t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());const c=character.hero?null:character.portraitCrop;if(c){t.repeat.set(c.width,c.height);t.offset.set(c.x,1-c.y-c.height);}t.needsUpdate=true;return t;},[base,character,gl]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 const aspect=character.hero?character.assetWidth/character.assetHeight:character.assetWidth*(character.portraitCrop?.width??1)/(character.assetHeight*(character.portraitCrop?.height??1));
 useFrame(()=>{gl.domElement.dataset.characterAsset=character.asset;if(group.current){group.current.position.set(x+(progress-.5)*.35,-.15,z+progress*.25);group.current.rotation.y=(progress-.5)*.035;}});
 return <group ref={group}><mesh><planeGeometry args={[height*aspect,height]}/><meshBasicMaterial map={texture} transparent alphaTest={.025} depthWrite={false} toneMapped={false}/></mesh><mesh position={[0,-height*.49,-.03]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[height*.2,40]}/><meshBasicMaterial color="#03080d" transparent opacity={.24} depthWrite={false}/></mesh></group>;
}
function CharacterStage({sceneId,progress,characterId,low}:{sceneId:number;progress:number;characterId:string|null;low:boolean}){
 const hero=sceneId>=36&&sceneId<=41?characters[sceneId-36]:null;
 const supporting=characters.filter(c=>!c.hero&&c.asset);
 const selected=characterId?supporting.find(c=>c.id===characterId):supporting.find(c=>c.id==='thess')??supporting[0];
 if(hero)return <CastPlane character={hero} x={low?-.3:-1.6} height={low?6.5:7.3} progress={progress}/>;
 if(sceneId===42&&characterId==='origin')return null;
 if(sceneId===42&&selected)return <CastPlane character={selected} x={low?-.5:-1.9} height={6.5} progress={progress}/>;
 if(sceneId===43)return <>{[characters[0],characters[2],characters[4]].map((c,i)=><CastPlane key={c.id} character={c} x={(i-1)*3.8-1.8} height={low?3:4.8} z={-5-i*.1} progress={progress}/>)}</>;
 return null;
}
function Ring({index,progress,ambient}:{index:number;progress:number;ambient:React.MutableRefObject<number>}){
 const group=useRef<THREE.Group>(null),r=1.4+index*.62;
 const armor=useMemo(()=>{const shape=new THREE.Shape();shape.absarc(0,0,r+.16,-.075,.075,false);shape.lineTo(Math.cos(.075)*(r-.13),Math.sin(.075)*(r-.13));shape.absarc(0,0,r-.13,.075,-.075,true);shape.closePath();return new THREE.ExtrudeGeometry(shape,{depth:.19,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,steps:1,curveSegments:12});},[r]);
 useEffect(()=>()=>armor.dispose(),[armor]);
 useFrame(()=>{if(group.current){const angle=progress*Math.PI*(index%2?-.85:1.1)+ambient.current*.025*(index%2?-1:1);group.current.rotation.set(.1+index*.04,Math.sin(progress*2+index)*.14,angle);}});
 return useMemo(()=><group ref={group} position={[0,-.8,-6-index*1.9]}>
 <mesh><torusGeometry args={[r,.095,12,128]}/><meshStandardMaterial color="#6c5235" metalness={.85} roughness={.28}/></mesh>
 <mesh position={[0,0,.08]}><torusGeometry args={[r-.14,.012,6,128]}/><meshStandardMaterial color={index%2?'#e6b25f':'#59bfc9'} emissive={index%2?'#b07c32':'#2c949f'} emissiveIntensity={1.4} metalness={.4} roughness={.3}/></mesh>
 {Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return <group key={i} rotation={[0,0,a]}><mesh geometry={armor}><meshStandardMaterial color="#515962" metalness={.88} roughness={.27}/></mesh><mesh position={[r,0,.235]}><cylinderGeometry args={[.035,.035,.028,12]} /><meshStandardMaterial color="#c4a273" metalness={.95} roughness={.2}/></mesh></group>;})}
 </group>,[index,r,armor]);
}
function Machinery({progress,paused,low,sceneId}:{progress:number;paused:boolean;low:boolean;sceneId:number}){
 const ambient=useRef(0),{gl}=useThree();useFrame((_,dt)=>{if(!paused)ambient.current+=Math.min(dt,.05);gl.domElement.dataset.codexRings=String(low?4:7);gl.domElement.dataset.mechanismPhase=(progress*3.14+ambient.current*.025).toFixed(4);});
 return <group position={sceneId===45?[0,-progress*2,0]:[0,0,0]}>
 {Array.from({length:low?4:7},(_,i)=><Ring key={i} index={i} progress={progress} ambient={ambient}/>)}
 <mesh position={[0,-.8,-20]}><icosahedronGeometry args={[.65,3]}/><meshStandardMaterial color="#c4e2dc" emissive="#68b6bd" emissiveIntensity={1.1} metalness={.75} roughness={.24}/></mesh>
 {[-1,1].map(side=><group key={side}>{Array.from({length:8},(_,i)=><group key={i} position={[side*(3.3+i*.3),-4.5,-4-i*2]}><mesh><cylinderGeometry args={[.12,.18,8,12]}/><meshStandardMaterial color="#384049" metalness={.8} roughness={.32}/></mesh><mesh position={[side*.25,0,0]}><cylinderGeometry args={[.022,.022,8,8]}/><meshStandardMaterial color="#a67d42" emissive="#8a6b37" emissiveIntensity={.4}/></mesh></group>)}</group>)}
 <pointLight position={[0,-1,-5]} color="#6bd0d9" intensity={18} distance={25}/><pointLight position={[-5,2,0]} color="#d2a36c" intensity={35} distance={28}/>
 </group>;
}
function Hangar({progress}:{progress:number}){
 const gantry=useRef<THREE.Group>(null);useFrame(()=>{if(gantry.current)gantry.current.position.x=-4+progress*7;});
 return useMemo(()=><group>
 <mesh position={[0,-4.1,-7]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[35,40]}/><meshStandardMaterial color="#151f29" metalness={.78} roughness={.3}/></mesh>
 {[-1,1].map(side=><group key={side} position={[side*6,3.4,-10]}><mesh><boxGeometry args={[.16,.18,20]}/><meshStandardMaterial color="#69533a" metalness={.9} roughness={.25}/></mesh><mesh position={[0,.12,0]}><boxGeometry args={[.035,.03,19.8]}/><meshStandardMaterial color="#7f999e" emissive="#4a7178" emissiveIntensity={.6}/></mesh></group>)}
 <group ref={gantry} position={[-4,3,-9]}><mesh><boxGeometry args={[2,.4,1.4]}/><meshStandardMaterial color="#8a6a3e" metalness={.8} roughness={.3}/></mesh><mesh position={[0,-1,0]}><cylinderGeometry args={[.045,.045,2,8]}/><meshStandardMaterial color="#66717a" metalness={.9} roughness={.3}/></mesh></group>
 </group>,[]);
}
function LightLanguage({progress,sceneId,paused,low}:{progress:number;sceneId:number;paused:boolean;low:boolean}){
 const ref=useRef<THREE.InstancedMesh>(null),dummy=useMemo(()=>new THREE.Object3D(),[]),ambient=useRef(0),{gl}=useThree();const count=low?80:280;
 useFrame((_,dt)=>{if(!paused)ambient.current+=Math.min(dt,.05);const phase=progress*Math.PI*2+ambient.current*.035;for(let i=0;i<count;i++){const band=i%4,a=(i/count)*Math.PI*2+phase*(band%2?-1:1),r=2+band*.65;dummy.position.set(Math.cos(a)*r,Math.sin(a)*r+1,-6-band*2);dummy.rotation.set(a,phase,a*.5);dummy.scale.setScalar(.025+(i%3)*.012);dummy.updateMatrix();ref.current?.setMatrixAt(i,dummy.matrix);}if(ref.current)ref.current.instanceMatrix.needsUpdate=true;gl.domElement.dataset.aericElements=String(count);gl.domElement.dataset.aericPhase=phase.toFixed(4);});
 return <group><instancedMesh ref={ref} args={[undefined,undefined,count]}><octahedronGeometry args={[1,0]}/><meshStandardMaterial color="#acd9db" emissive="#5cb6c0" emissiveIntensity={1.4} roughness={.3} metalness={.6}/></instancedMesh>{sceneId===32?<mesh position={[0,-2,-4]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[2.7,.07,10,90]}/><meshStandardMaterial color="#92734e" metalness={.85} roughness={.3}/></mesh>:null}</group>;
}
function SensorFilaments({progress,paused}:{progress:number;paused:boolean}){
 const ref=useRef<THREE.Group>(null),ambient=useRef(0);useFrame((_,dt)=>{if(!paused)ambient.current+=Math.min(dt,.05);if(ref.current){ref.current.rotation.y=progress*.5+Math.sin(ambient.current*.5)*.06;ref.current.rotation.z=Math.sin(progress*3)*.03;}});
 return <group ref={ref} position={[-3,-2,-4]}>{Array.from({length:17},(_,i)=>{const a=(i/16-.5)*2.3;return <mesh key={i} position={[Math.sin(a)*1.2,Math.cos(a)*1.2,0]} rotation={[0,0,-a]}><cylinderGeometry args={[.004,.012,1.5,6]}/><meshStandardMaterial color="#689d9e" emissive="#3a7881" emissiveIntensity={.7} metalness={.25} roughness={.5}/></mesh>;})}</group>;
}
function CircuitWindows({progress,sceneId,reduced}:{progress:number;sceneId:number;reduced:boolean}){
 const ref=useRef<THREE.InstancedMesh>(null),dummy=useMemo(()=>new THREE.Object3D(),[]),{gl}=useThree();const count=320;
 useFrame(()=>{let lit=0;for(let i=0;i<count;i++){const tower=i%8,row=Math.floor(i/8)%20,side=i%2?-1:1;const on=progress>(i%41)/65;const pulse=sceneId===35&&!reduced?.62+.3*Math.sin(progress*Math.PI*3):1;dummy.position.set(side*(4+tower*.3),-2+row*.32,-8-Math.floor(i/160)*7);dummy.scale.set(on?.025*pulse:0,.018,1);if(on)lit++;dummy.updateMatrix();ref.current?.setMatrixAt(i,dummy.matrix);}if(ref.current)ref.current.instanceMatrix.needsUpdate=true;gl.domElement.dataset.activatedCityLights=String(lit);});
 return <instancedMesh ref={ref} args={[undefined,undefined,count]}><planeGeometry args={[1,1]}/><meshBasicMaterial color="#f1c47f" toneMapped={false}/></instancedMesh>;
}
export default function FinaleWorld({sceneId,progress,paused,quality,characterId,reducedMotion=false}:{sceneId:number;progress:number;paused:boolean;quality:'low'|'high';characterId:string|null;reducedMotion?:boolean}){
 const low=quality==='low',{gl}=useThree();useFrame(()=>{gl.domElement.dataset.finaleScene=String(sceneId);gl.domElement.dataset.character=sceneId>=36&&sceneId<=41?characters[sceneId-36].id:sceneId===42?characterId??'thess':'none';gl.domElement.dataset.independentFinaleMotion='true';});
 return <>
 {[29,34,35].includes(sceneId)?<CircuitWindows progress={progress} sceneId={sceneId} reduced={reducedMotion}/>:null}
 {[36,37].includes(sceneId)?<Hangar progress={progress}/>:null}
 {([34,39,45,46].includes(sceneId)||sceneId===42&&characterId==='origin')?<Machinery progress={progress} paused={paused} low={low} sceneId={sceneId}/>:null}
 {[29,30,31,32,34,35,44,47,48].includes(sceneId)?<LightLanguage progress={progress} sceneId={sceneId} paused={paused} low={low}/>:null}
 {sceneId===33?<SensorFilaments progress={progress} paused={paused}/>:null}
 <Suspense fallback={null}><CharacterStage sceneId={sceneId} progress={progress} characterId={characterId} low={low}/></Suspense>
 </>;
}
