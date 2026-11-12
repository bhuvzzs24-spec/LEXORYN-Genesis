'use client';
import {Canvas,useFrame} from '@react-three/fiber';
import {Stars} from '@react-three/drei';
import {Component,Suspense,useRef,type ReactNode} from 'react';
import * as THREE from 'three';
import PlanetSystem from '../PlanetSystem';
import CinematicGrade from '../CinematicGrade';
import FinaleWorld from './FinaleWorld';
import {correctedShots} from '@/lib/scene-visuals';
import {finaleAssetRequest,emergencyRegion} from '@/lib/finale';
import {storyScenes} from '@/data/story';
import {cinematicLayerBlend} from '@/lib/cinematography';
import {resolveSceneAsset,sceneDepthAssets} from './SceneAssetRegistry';
import {LayeredEnvironment} from './LayeredEnvironment';
import {SceneObjectLayer} from './SceneObjectLayer';
import {NativeDrifters} from './NativeDrifters';
import {ScrollCameraRig} from './ScrollCameraRig';
import {AnimatedVehicleLayer,AtmosphericEffects,CivicMechanisms,FestivalDrones} from './WorldLayers';
export interface CinematicSceneProps {sceneIndex:number;progress:number;paused:boolean;reducedMotion:boolean;quality:'high'|'low';selectedRegion:string|null;onSelectRegion:(id:string)=>void;onFailure:()=>void;planetKey:number;focusedObjectId:string|null;onHoverObject:(id:string|null)=>void;outcomeAsset?:string;characterId:string|null;}
class AssetBoundary extends Component<{children:ReactNode;fallback?:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?this.props.fallback??null:this.props.children;}}
function Transmission({progress}:{progress:number}){const ref=useRef<THREE.Group>(null);useFrame(()=>{if(ref.current){ref.current.rotation.z=progress*Math.PI*.4;ref.current.scale.setScalar(.5+progress*.2);}});return <group ref={ref} position={[-1,.5,2]}>{[0,1,2,3].map(i=><mesh key={i} rotation={[i*.1,.15,0]}><torusGeometry args={[.6+i*.2,.004,6,70]}/><meshBasicMaterial color={i%2?'#f4c37a':'#59dbe7'} transparent opacity={.4}/></mesh>)}</group>;}
function SceneWorld(props:CinematicSceneProps){
 const scene=storyScenes[props.sceneIndex],next=storyScenes[props.sceneIndex+1];
 const low=props.quality==='low',media=resolveSceneAsset(finaleAssetRequest(scene.id,props.progress,scene.asset,props.outcomeAsset),low);const mix=cinematicLayerBlend(props.progress);
 const orbital=scene.mode==='orbit',entering=scene.id===6||scene.id===7;
 const showWorld=!orbital||entering;
 const common={progress:props.progress,paused:props.paused,reducedMotion:props.reducedMotion,quality:props.quality};
 const variant=correctedShots[scene.id]?.variant??(scene.id===51?emergencyRegion(props.progress).effect:scene.id===31?'cuisine':scene.id===22?'cuisine':scene.id===23?'atelier':scene.id===24?'objects':scene.id===25?'council':scene.id===26?'commons':scene.id===27?'ecosystem':scene.palette);
 const nextMedia=next?resolveSceneAsset(finaleAssetRequest(next.id,0,next.asset,props.outcomeAsset),low):media;
 const nextVariant=(next&&correctedShots[next.id]?.variant)??(next?.id===31?'cuisine':next?.id===22?'cuisine':next?.id===23?'atelier':next?.id===24?'objects':next?.id===25?'council':next?.id===26?'commons':next?.id===27?'ecosystem':next?.palette??variant);
 const changes=!!next&&next.mode==='world'&&(nextMedia.src!==media.src||nextVariant!==variant);
 const civic=scene.id===10?'transit':scene.id===12?'energy':[14,21].includes(scene.id)?'network':scene.id===25?'council':scene.id===26?'clinic':'none';
 return <>
  <ScrollCameraRig {...props}/><CinematicGrade enabled={!low}/>
  <ambientLight intensity={orbital?.075:.3}/><directionalLight position={[-9,5,8]} intensity={3.3} color={scene.lighting.key}/><directionalLight position={[5,-2,-4]} intensity={.22} color={scene.lighting.fill}/>
  <group visible={orbital&&scene.id!==7&&(scene.id!==6||props.progress<.58)} position={[1.25,.1,0]}><PlanetSystem orbitalProgress={scene.id===2?props.progress:scene.id>2?1:0} key={props.planetKey} progress={scene.id<=5||scene.id===15||scene.id===56?0:.4} paused={props.paused||!orbital} reducedMotion={props.reducedMotion} selectedRegion={props.selectedRegion} onSelectRegion={props.onSelectRegion}/></group>
  <group visible={orbital&&!entering}><Stars radius={75} depth={30} count={low?600:2200} factor={1.4} fade speed={0}/></group>
  {scene.id===4?<Transmission progress={props.progress}/>:null}
  {scene.id===5?<AnimatedVehicleLayer {...common} variant="fleet"/>:null}
  {showWorld?<>
   <Suspense fallback={null}><AssetBoundary key={media.src}><LayeredEnvironment {...common} {...sceneDepthAssets(scene.asset)} asset={media.src} aspect={media.width/media.height} variant={entering?'storm':variant} foreground={!entering&&scene.id<29} architecture={!entering&&scene.id<29&&(correctedShots[scene.id]?.architecture??true)} opacity={(changes?1-mix:1)*(scene.id===35&&!props.reducedMotion?.87+.1*Math.sin(props.progress*Math.PI*3):1)}/></AssetBoundary></Suspense>
   {changes&&props.progress>.78?<Suspense fallback={null}><AssetBoundary key={nextMedia.src}><LayeredEnvironment {...common} {...sceneDepthAssets(next.asset)} asset={nextMedia.src} aspect={nextMedia.width/nextMedia.height} variant={nextVariant} depth={-28.05} foreground={next.id<29} architecture={next.id<29&&(correctedShots[next.id]?.architecture??true)} progress={0} opacity={mix}/></AssetBoundary></Suspense>:null}
   {[22,24,31].includes(scene.id)?<Suspense fallback={null}><AssetBoundary key={`items-${scene.id}`}><SceneObjectLayer scene={scene} focusedId={props.focusedObjectId} onHover={props.onHoverObject}/></AssetBoundary></Suspense>:null}
   <AtmosphericEffects {...common} variant={scene.id===51?emergencyRegion(props.progress).effect:entering?'storm':scene.effect==='steam'?'market':scene.palette} seed={3186+scene.id}/>
   {!entering?<AnimatedVehicleLayer {...common} variant={scene.vehicle}/>:null}
   {!entering?<CivicMechanisms {...common} variant={civic}/>:null}
   {scene.id===24?<pointLight position={[Math.sin(props.progress*Math.PI*2)*5,1,4]} color="#59dbe7" intensity={2} distance={15}/>:null}
   {scene.id===27?<NativeDrifters progress={props.progress} low={low}/>:null}
   {[28,29,30,32,34].includes(scene.id)?<FestivalDrones {...common} variant="festival"/>:null}
  </>:null}
  {scene.id>=29&&scene.id<56?<FinaleWorld sceneId={scene.id} progress={props.progress} paused={props.paused} quality={props.quality} characterId={props.characterId} reducedMotion={props.reducedMotion}/>:null}
 </>;
}
export default function FullscreenCinematicScene(props:CinematicSceneProps){return <Canvas camera={{position:[0,.3,9.2],fov:42,near:.03,far:180}} dpr={props.quality==='low'?[1,1.1]:[1,1.75]} gl={{alpha:true,antialias:true,powerPreference:props.quality==='low'?'low-power':'high-performance'}} onCreated={({gl})=>{gl.setClearColor('#050a12',0);gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.03;gl.domElement.addEventListener('webglcontextlost',props.onFailure,{once:true});}} fallback={<span>Interactive cinematic canvas. Scene navigation, climate profiles and descriptions are available outside this canvas.</span>}><Suspense fallback={null}><SceneWorld {...props}/></Suspense></Canvas>;}
