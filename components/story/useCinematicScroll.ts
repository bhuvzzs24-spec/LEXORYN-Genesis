'use client';
import {useCallback,useEffect,useRef,type RefObject} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {progressForScene,totalStoryDuration} from '@/lib/story';

/** One bounded scrub owns every layer. Camera and traffic never chase different scroll clocks. */
export function useCinematicScroll({root,stage,mobile,reduced,onProgress}:{root:RefObject<HTMLElement|null>;stage:RefObject<HTMLDivElement|null>;mobile:boolean;reduced:boolean;onProgress:(p:number)=>void}){
 const trigger=useRef<ScrollTrigger|null>(null),animation=useRef<gsap.core.Tween|null>(null);
 const rendered=useRef(0),navigation=useRef<gsap.core.Timeline|null>(null),navigationVeil=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);const restore=rendered.current,driver={progress:0};let raf=0,active=true;
  const context=gsap.context(()=>{
   animation.current=gsap.to(driver,{progress:1,duration:1,ease:'none',paused:true,onUpdate:()=>{if(!active)return;rendered.current=driver.progress;onProgress(driver.progress);if(stage.current)stage.current.dataset.renderedProgress=driver.progress.toFixed(6);}});
   trigger.current=ScrollTrigger.create({trigger:root.current,pin:stage.current,animation:animation.current,start:'top top',end:()=>`+=${innerHeight*totalStoryDuration*(mobile?.78:1.04)}`,scrub:reduced?true:mobile?.24:.42,anticipatePin:1,invalidateOnRefresh:true,onUpdate:t=>{if(stage.current)stage.current.dataset.scrollTarget=t.progress.toFixed(6);}});
   if(restore>0)raf=requestAnimationFrame(()=>{const t=trigger.current;if(t){window.scrollTo({top:t.start+restore*(t.end-t.start),behavior:'instant'});ScrollTrigger.update();const scrub=t.getTween();if(scrub&&typeof scrub.progress==='function')scrub.progress(1);animation.current?.progress(restore);}});
  },root);
  const interrupt=()=>{navigation.current?.kill();if(navigationVeil.current)gsap.to(navigationVeil.current,{opacity:0,duration:.18,overwrite:true});};
  window.addEventListener('wheel',interrupt,{passive:true});window.addEventListener('touchstart',interrupt,{passive:true});
  return()=>{active=false;cancelAnimationFrame(raf);interrupt();window.removeEventListener('wheel',interrupt);window.removeEventListener('touchstart',interrupt);trigger.current=null;animation.current=null;context.revert();};
 },[mobile,reduced,onProgress,root,stage]);
 const goTo=useCallback((index:number,local=.18)=>{
  const t=trigger.current;if(!t)return;navigation.current?.kill();const p=progressForScene(index,local),target=t.start+p*(t.end-t.start);
  const snap=()=>{window.scrollTo({top:target,behavior:'instant'});ScrollTrigger.update();const scrub=t.getTween();if(scrub&&typeof scrub.progress==='function')scrub.progress(1);animation.current?.progress(p);};
  if(reduced){snap();return;}
  const timeline=gsap.timeline();navigation.current=timeline;
  if(Math.abs(rendered.current-p)>.09&&navigationVeil.current){
   timeline.to(navigationVeil.current,{opacity:1,duration:.22,ease:'sine.inOut'}).call(snap).to(navigationVeil.current,{opacity:0,duration:.52,ease:'sine.out'},'+=.04');
  }else{const driver={y:scrollY};timeline.to(driver,{y:target,duration:.9,ease:'sine.inOut',onUpdate:()=>window.scrollTo({top:driver.y,behavior:'instant'})});}
 },[reduced]);
 return {trigger,goTo,navigationVeil};
}
