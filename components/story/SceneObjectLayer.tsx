'use client';
import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree,type ThreeEvent} from '@react-three/fiber';
import {useCinematicTexture} from './useCinematicTexture';
import * as THREE from 'three';
import type {StoryScene} from '@/data/story';
import {sampleCinematicCamera} from '@/lib/cinematography';
import {inspectionMedia,lowInspectionMedia} from './SceneAssetRegistry';
import type {InspectionMedia} from './InspectionExhibit';

const vertex=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragment=`
uniform sampler2D uAtlas; uniform vec4 uCrop; uniform float uOpacity; uniform float uFocus; varying vec2 vUv;
void main(){
 vec2 uv=vec2(uCrop.x+vUv.x*uCrop.z,1.-uCrop.y-uCrop.w+vUv.y*uCrop.w);
 vec4 c=texture2D(uAtlas,uv);vec2 d=vec2(.0012);
 float edge=max(max(texture2D(uAtlas,uv+vec2(d.x,0.)).a,texture2D(uAtlas,uv-vec2(d.x,0.)).a),max(texture2D(uAtlas,uv+vec2(0.,d.y)).a,texture2D(uAtlas,uv-vec2(0.,d.y)).a));
 float rim=max(0.,edge-c.a)*uFocus;float alpha=max(c.a,rim*.85)*uOpacity;if(alpha<.015)discard;
 vec3 color=mix(c.rgb,vec3(.92,.76,.46),rim*.8);gl_FragColor=vec4(pow(color,vec3(2.2))*(1.+uFocus*.1),alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;

function Item({id,media,position,width,focused,anyFocused,onHover}:{id:string;media:InspectionMedia;position:THREE.Vector3;width:number;focused:boolean;anyFocused:boolean;onHover:(id:string|null)=>void}){
 const texture=useCinematicTexture(media.src),mesh=useRef<THREE.Mesh>(null),current=useRef(0),{camera,gl,size}=useThree();
 const crop=media.crop??{x:0,y:0,width:1,height:1},aspect=media.width*crop.width/(media.height*crop.height);
 const uniforms=useMemo(()=>({uAtlas:{value:texture},uCrop:{value:new THREE.Vector4(crop.x,crop.y,crop.width,crop.height)},uOpacity:{value:1},uFocus:{value:0}}),[texture,crop.x,crop.y,crop.width,crop.height]);
 const point=useMemo(()=>new THREE.Vector3(),[]);
 const owner=useRef<HTMLElement|null>(null);
 useEffect(()=>{owner.current=gl.domElement.closest('[data-testid="story-stage"]');return()=>{owner.current?.style.removeProperty(`--exhibit-${id}-x`);owner.current?.style.removeProperty(`--exhibit-${id}-y`);};},[gl,id]);
 useFrame((_,delta)=>{
  current.current=THREE.MathUtils.damp(current.current,focused?1:0,10,Math.min(delta,.05));
  const f=current.current;uniforms.uFocus.value=f;uniforms.uOpacity.value=anyFocused&&!focused?.32:1;
  if(!mesh.current)return;mesh.current.position.copy(position);mesh.current.position.y+=f*.22;mesh.current.position.z+=f*.5;
  mesh.current.rotation.set(-.045+f*.025,Math.sin(f*.6)*.04,0);mesh.current.scale.setScalar(1+f*.07);
  point.copy(position).project(camera);owner.current?.style.setProperty(`--exhibit-${id}-x`,`${(point.x*.5+.5)*100}%`);owner.current?.style.setProperty(`--exhibit-${id}-y`,`${(-point.y*.5+.5)*100}%`);
  if(focused){gl.domElement.dataset.inspectedObject=id;gl.domElement.dataset.objectLift=f.toFixed(3);}
  gl.domElement.dataset.objectViewport=String(size.width);
 });
 const enter=(event:ThreeEvent<PointerEvent>)=>{event.stopPropagation();onHover(id);};
 return <mesh ref={mesh} position={position} onPointerOver={enter} onPointerMove={enter} onPointerOut={()=>onHover(null)} onClick={enter}>
  <planeGeometry args={[width,width/aspect]}/><shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent depthWrite={false} toneMapped={false}/>
 </mesh>;
}

/** Separate image objects in perspective, with real spatial lift; source images remain explicitly identified. */
export function SceneObjectLayer({scene,focusedId,onHover}:{scene:StoryScene;focusedId:string|null;onHover:(id:string|null)=>void}){
 const {size,gl}=useThree(),low=size.width<700;
 const items=useMemo(()=>{
  const pose=sampleCinematicCamera(scene.id-1,.4,low,size.width/size.height),camera=new THREE.PerspectiveCamera(42,size.width/size.height,.03,180);camera.position.set(...pose.position);camera.lookAt(new THREE.Vector3(...pose.target));camera.updateMatrixWorld();
  return scene.hotspots.flatMap((h,i)=>{const media=(low?lowInspectionMedia:inspectionMedia)[h.id];if(!media)return[];const point=new THREE.Vector3(h.position[0]*2-1,1-h.position[1]*2,.5).unproject(camera),direction=point.sub(camera.position).normalize(),z=[22,31].includes(scene.id)?-.8-i*.035:-1.1-(i%3)*.12;const k=(z-camera.position.z)/direction.z;const position=camera.position.clone().addScaledVector(direction,k);return[{id:h.id,media,position,width:(low?1.18:[22,31].includes(scene.id)?2.85:1.85)*(scene.id===31?.65:1)*(h.category==='footwear'?.82:1)}];});
 },[scene,low,size.width,size.height]);
 useFrame(()=>{gl.domElement.dataset.independentItems=String(items.length);gl.domElement.dataset.inspectedObject=focusedId??'';if(!focusedId)gl.domElement.dataset.objectLift='0';});
 return <group>{items.map(item=><Item key={item.id} {...item} focused={focusedId===item.id} anyFocused={!!focusedId} onHover={onHover}/>)}</group>;
}
