'use client';
import {useEffect,useMemo} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {Vector2} from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
/** Restrained high-luminance bloom; low quality bypasses the extra render targets. */
export default function CinematicGrade({enabled}:{enabled:boolean}){
 const {gl,scene,camera,size}=useThree();
 const composer=useMemo(()=>{if(!enabled)return null;const c=new EffectComposer(gl);c.addPass(new RenderPass(scene,camera));c.addPass(new UnrealBloomPass(new Vector2(1,1),.17,.24,.95));c.addPass(new OutputPass());return c;},[gl,scene,camera,enabled]);
 useEffect(()=>{if(!composer)return;composer.setPixelRatio(Math.min(gl.getPixelRatio(),1.4));composer.setSize(size.width,size.height);},[composer,gl,size.width,size.height]);
 useEffect(()=>()=>{if(!composer)return;for(const pass of composer.passes)pass.dispose();composer.dispose();},[composer]);
 useFrame((_,delta)=>{if(composer)composer.render(delta);else gl.render(scene,camera);},1);
 return null;
}
