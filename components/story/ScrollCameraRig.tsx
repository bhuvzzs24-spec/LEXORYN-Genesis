'use client';
import {useMemo} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {sampleCamera,smoothStoryProgress} from '@/lib/story';
import {storyScenes} from '@/data/story';
export function ScrollCameraRig({sceneIndex,progress,selectedRegion,reducedMotion}:{sceneIndex:number;progress:number;selectedRegion:string|null;reducedMotion:boolean}){
 const {camera,gl,size}=useThree();const target=useMemo(()=>new THREE.Vector3(),[]);
 useFrame(()=>{
  const scene=storyScenes[sceneIndex],pose=sampleCamera(scene,progress);
  const fit=(id:number,p:readonly number[],t:readonly number[])=>{const position=[...p],look=[...t];if(size.width<700&&(id<6||id===15)){position[2]*=1.32;look[0]=1.1;}return {position,target:look};};
  const fitted=fit(scene.id,pose.position,pose.target),position=fitted.position,look=fitted.target;
  // Cross-scene endpoint blending prevents a camera-coordinate jump while the scenery dissolves.
  const next=storyScenes[sceneIndex+1];
  if(next&&progress>.82){const rawNext=sampleCamera(next,0),nextPose=fit(next.id,rawNext.position,rawNext.target),t=smoothStoryProgress((progress-.82)/.18);for(let i=0;i<3;i++){position[i]+=(nextPose.position[i]-position[i])*t;look[i]+=(nextPose.target[i]-look[i])*t;}}
  if(selectedRegion&&scene.mode==='orbit'){position[0]=1.25;position[1]=.3;position[2]=6.4;look[0]=1.25;look[1]=.1;look[2]=0;}
  if(scene.id===6&&!reducedMotion){position[0]+=Math.sin(progress*39)*.003;position[1]+=Math.sin(progress*51)*.002;}
  camera.position.set(position[0],position[1],position[2]);target.set(look[0],look[1],look[2]);camera.lookAt(target);camera.updateMatrixWorld();
  gl.domElement.dataset.cameraPosition=position.map(v=>v.toFixed(4)).join(',');gl.domElement.dataset.cameraZ=position[2].toFixed(4);gl.domElement.dataset.scene=String(scene.id);gl.domElement.dataset.localProgress=progress.toFixed(4);
 });return null;
}
