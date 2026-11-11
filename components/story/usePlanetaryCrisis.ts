'use client';
import {useEffect,useState} from 'react';
import {applyDecision,initialCrisis,restoreCrisis,type CrisisState} from '@/lib/crisis';
const storageKey='lexoryn-crisis-v1';
/** Local, versioned simulation. Replayed history is authoritative; storage failures are nonfatal. */
export function usePlanetaryCrisis(){
 const [state,setState]=useState<CrisisState>(initialCrisis),[loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(storageKey);if(raw)setState(restoreCrisis(JSON.parse(raw)));}catch{}setLoaded(true);},[]);
 useEffect(()=>{if(loaded)try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{}},[state,loaded]);
 return {state,choose:(id:string)=>setState(s=>applyDecision(s,id)),reset:()=>setState(initialCrisis())};
}
