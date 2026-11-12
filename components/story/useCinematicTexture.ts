'use client';
import {useEffect} from 'react';
import {useTexture} from '@react-three/drei';
const leases=new Map<string,{count:number;timer:ReturnType<typeof setTimeout>|null}>();
/** Shared layers retain textures through crossfades; unused images leave the GPU cache. */
export function useCinematicTexture(src:string){
 const texture=useTexture(src);
 useEffect(()=>{const lease=leases.get(src)??{count:0,timer:null};if(lease.timer)clearTimeout(lease.timer);lease.count++;leases.set(src,lease);return()=>{lease.count--;if(!lease.count)lease.timer=setTimeout(()=>{if(lease.count)return;useTexture.clear(src);texture.dispose();leases.delete(src);},2500);};},[src,texture]);
 return texture;
}
