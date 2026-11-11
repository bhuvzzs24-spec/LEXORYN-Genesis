'use client';
import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';

/** Original small mist-skates: separate scroll-driven fauna, not animated pixels in the plate. */
export function NativeDrifters({progress,low}:{progress:number;low:boolean}){
 const groups=useRef<(THREE.Group|null)[]>([]),wings=useRef<(THREE.Group|null)[]>([]);
 const {gl}=useThree();
 const resources=useMemo(()=>{
  const membrane=new THREE.PlaneGeometry(1,1,20,30),p=membrane.attributes.position;
  for(let i=0;i<p.count;i++){const u=p.getX(i)+.5,v=(p.getY(i)+.5)*2-1;p.setXYZ(i,.07+Math.pow(Math.max(0,1-v*v),.72)*u*.8,Math.sin(u*Math.PI)*.08,v*.9+u*u*.2);}
  membrane.computeVertexNormals();
  return {membrane,body:new THREE.CapsuleGeometry(.07,.85,6,12),skin:new THREE.MeshStandardMaterial({color:'#35515a',roughness:.62,metalness:.08}),wing:new THREE.MeshPhysicalMaterial({color:'#759b9d',transparent:true,opacity:.67,roughness:.4,side:THREE.DoubleSide,depthWrite:false}),lumen:new THREE.MeshStandardMaterial({color:'#80cfbc',emissive:'#4e9c95',emissiveIntensity:.35,roughness:.6}),scute:new THREE.SphereGeometry(.065,10,6)};
 },[]);
 useEffect(()=>()=>{Object.values(resources).forEach(r=>r.dispose());},[resources]);
 const count=low?2:5;
 useFrame(()=>{
  groups.current.forEach((g,i)=>{if(!g)return;const p=progress,phase=i*1.73;g.position.set(-6+p*12+i*.7,1.4+Math.sin(p*3+phase)*.7,-4-i*1.8+p*.5);g.rotation.set(.1,Math.PI/2+.2*Math.sin(p*2+phase),.12*Math.cos(p*3+phase));});
  wings.current.forEach((g,i)=>{if(g)g.rotation.z=Math.sin(progress*16+Math.floor(i/2)*1.73)*.16*(i%2?-1:1);});
  gl.domElement.dataset.faunaProgress=progress.toFixed(4);gl.domElement.dataset.faunaCount=String(count);
 });
 return <group>{Array.from({length:count},(_,i)=><group key={i} ref={g=>{groups.current[i]=g;}} scale={.23+i*.015} dispose={null}>
  <mesh geometry={resources.body} material={resources.skin} rotation={[Math.PI/2,0,0]} scale={[1,1,1.25]}/>
  {[-1,1].map((side,j)=><group key={side} ref={g=>{wings.current[i*2+j]=g;}} scale={[side,1,1]}><mesh geometry={resources.membrane} material={resources.wing}/></group>)}
  {Array.from({length:7},(_,n)=><mesh key={n} position={[0,.065,-.38+n*.125]} geometry={resources.scute} material={n%3===0?resources.lumen:resources.skin} scale={[.75,.3,1.4]}/>)}
 </group>)}</group>;
}
