import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const emit=name=>ts.transpileModule(fs.readFileSync(new URL(name,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const moduleUrl=code=>'data:text/javascript;base64,'+Buffer.from(code).toString('base64');
const dataUrl=moduleUrl(emit('../data/story.ts'));
const {storyScenes}=await import(dataUrl);
const {sampleCinematicCamera,cinematicLayerBlend}=await import(moduleUrl(emit('../lib/cinematography.ts').replace(/from ['"]@\/data\/story['"]/g,`from '${dataUrl}'`)));

test('desktop and mobile camera boundaries match exactly across all28 beats',()=>{
 for(const mobile of [false,true])for(let i=0;i<27;i++)assert.deepEqual(sampleCinematicCamera(i,1,mobile),sampleCinematicCamera(i+1,0,mobile),`scene${i+1}→${i+2}`);
});

test('camera velocity is C1 at weighted scene joins, including mobile orbital hand-offs',()=>{
 const epsilon=1e-5;
 for(const mobile of [false,true])for(let i=0;i<27;i++)for(const field of ['position','target']){
  const a=sampleCinematicCamera(i,1-epsilon,mobile)[field],boundary=sampleCinematicCamera(i,1,mobile)[field],b=sampleCinematicCamera(i+1,epsilon,mobile)[field];
  for(let axis=0;axis<3;axis++){
   const left=(boundary[axis]-a[axis])/(epsilon*storyScenes[i].duration);
   const right=(b[axis]-boundary[axis])/(epsilon*storyScenes[i+1].duration);
   assert.ok(Math.abs(left-right)<.006,`${mobile?'mobile':'desktop'} ${i+1}→${i+2} ${field}.${axis}: ${left} / ${right}`);
  }
 }
});

test('cinematic sampling is bounded, finite and exactly reversible without a frame clock',()=>{
 for(const mobile of [false,true])for(let i=0;i<28;i++){
  const points=Array.from({length:101},(_,step)=>sampleCinematicCamera(i,step/100,mobile));
  for(let step=100;step>=0;step--){
   assert.deepEqual(sampleCinematicCamera(i,step/100,mobile),points[step]);
   assert.ok([...points[step].position,...points[step].target].every(Number.isFinite));
   assert.ok(points[step].position[2]>2.8&&points[step].position[2]<15);
   if(step)assert.ok(Math.hypot(...points[step].position.map((n,axis)=>n-points[step-1].position[axis]))<.18);
  }
 }
 assert.deepEqual(sampleCinematicCamera(NaN,NaN),sampleCinematicCamera(0,0));
 assert.deepEqual(sampleCinematicCamera(100,10),sampleCinematicCamera(27,1));
 assert.equal(cinematicLayerBlend(0),0);assert.equal(cinematicLayerBlend(.78),0);assert.equal(cinematicLayerBlend(1),1);
});

test('capital shots continue spatially instead of repeating the same zoom and entry has no negative-z reset',()=>{
 const city=Array.from({length:5},(_,i)=>sampleCinematicCamera(i+7,.5));
 assert.equal(new Set(city.map(p=>p.position.join(','))).size,5);
 assert.ok(city.some((p,i)=>i&&p.position[0]<city[i-1].position[0]));
 assert.ok(city.some((p,i)=>i&&p.position[0]>city[i-1].position[0]));
 for(let step=0;step<=100;step++)for(const i of [5,6])assert.ok(sampleCinematicCamera(i,step/100).position[2]>3);
 const cloudStart=sampleCinematicCamera(6,0).position,cityStart=sampleCinematicCamera(7,0).position;
 assert.ok(Math.hypot(...cityStart.map((n,i)=>n-cloudStart[i]))<8);
});
