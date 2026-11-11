'use client';
import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {sampleCinematicCamera} from '@/lib/cinematography';
export function ScrollCameraRig({sceneIndex,progress,selectedRegion,reducedMotion,planetKey}:{sceneIndex:number;progress:number;selectedRegion:string|null;reducedMotion:boolean;planetKey?:number}){
 const {camera,gl,size}=useThree(),target=useMemo(()=>new THREE.Vector3(),[]),focus=useRef(0);
 useEffect(()=>{focus.current=0;},[planetKey]);
 useFrame((_,delta)=>{
  const pose=sampleCinematicCamera(sceneIndex,progress,size.width<700),orbital=sceneIndex<5||sceneIndex===14||sceneIndex===55;
  focus.current=reducedMotion?(selectedRegion&&orbital?1:0):THREE.MathUtils.damp(focus.current,selectedRegion&&orbital?1:0,7,Math.min(delta,.05));
  const position=[...pose.position],look=[...pose.target],f=focus.current;
  if(f>.0001){const fp=[1.25,.3,size.width<700?9:6.4],ft=[1.25,.1,0];for(let i=0;i<3;i++){position[i]=THREE.MathUtils.lerp(position[i],fp[i],f);look[i]=THREE.MathUtils.lerp(look[i],ft[i],f);}}
  if(sceneIndex===5&&!reducedMotion){position[0]+=Math.sin(progress*39)*.0015;position[1]+=Math.sin(progress*51)*.001;}
  camera.position.set(...position as [number,number,number]);target.set(...look as [number,number,number]);camera.lookAt(target);camera.updateMatrixWorld();
  gl.domElement.dataset.cameraPosition=position.map(v=>v.toFixed(4)).join(',');gl.domElement.dataset.cameraTarget=look.map(v=>v.toFixed(4)).join(',');gl.domElement.dataset.cameraZ=position[2].toFixed(4);gl.domElement.dataset.scene=String(sceneIndex+1);gl.domElement.dataset.localProgress=progress.toFixed(4);gl.domElement.dataset.cameraRoute='continuous-hermite-v2';
 });return null;
}
