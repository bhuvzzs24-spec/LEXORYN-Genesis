'use client';
import {useEffect,useRef,useState} from 'react';
interface SoundGraph {context:AudioContext;master:GainNode;hum:OscillatorNode;air:BiquadFilterNode;sources:AudioScheduledSourceNode[];}
/** Original synthesized ambience. No recordings, autoplay, or external sound downloads. */
export function useCinematicSound(palette:string){
 const graph=useRef<SoundGraph|null>(null);const [enabled,setEnabled]=useState(false);
 async function toggle(){
  if(!graph.current){
   const context=new AudioContext();const master=context.createGain();master.gain.value=0;master.connect(context.destination);
   const hum=context.createOscillator();hum.type='sine';hum.frequency.value=48;const humGain=context.createGain();humGain.gain.value=.24;hum.connect(humGain).connect(master);hum.start();
   const buffer=context.createBuffer(1,context.sampleRate*4,context.sampleRate),channel=buffer.getChannelData(0);let last=0;
   for(let i=0;i<channel.length;i++){last=(last+(Math.random()*2-1)*.04)/1.025;channel[i]=last*3;}
   const noise=context.createBufferSource();noise.buffer=buffer;noise.loop=true;const air=context.createBiquadFilter();air.type='lowpass';air.frequency.value=500;noise.connect(air).connect(master);noise.start();
   graph.current={context,master,hum,air,sources:[hum,noise]};
  }
  await graph.current.context.resume();const next=!enabled;graph.current.master.gain.setTargetAtTime(next?.085:0,graph.current.context.currentTime,.25);setEnabled(next);
 }
 useEffect(()=>{const g=graph.current;if(!g)return;const t=g.context.currentTime;const frequency=palette==='ice'?64:palette==='desert'?39:palette==='festival'?98:palette==='market'?73:48;g.hum.frequency.setTargetAtTime(frequency,t,.8);g.air.frequency.setTargetAtTime(palette==='storm'?1500:palette==='market'?850:450,t,.8);},[palette,enabled]);
 useEffect(()=>{if(!enabled||palette!=='festival')return;const timer=setInterval(()=>{const g=graph.current;if(!g)return;const note=g.context.createOscillator(),gain=g.context.createGain();const t=g.context.currentTime;note.type='sine';note.frequency.value=[196,246.94,293.66,392][Math.floor(Math.random()*4)];gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.08,t+.08);gain.gain.exponentialRampToValueAtTime(.001,t+2);note.connect(gain).connect(g.master);note.start(t);note.stop(t+2.1);},1000);return()=>clearInterval(timer);},[enabled,palette]);
 useEffect(()=>()=>{const g=graph.current;if(g){g.sources.forEach(s=>s.stop());void g.context.close();graph.current=null;}},[]);
 return {soundEnabled:enabled,toggleSound:toggle};
}
