import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PerspectiveCamera,Vector3} from 'three';
import {moduleURL} from './load-module.mjs';
const {storyScenes}=await import(moduleURL('../data/story.ts'));
const {montageShots,storyShots,montageDurationSeconds,showcaseDurationSeconds,showcaseFrame}=await import(moduleURL('../data/pacing.ts'));
const {planetEnvelopeRadius,finalPlanetFraming,crystalClusters}=await import(moduleURL('../lib/planet-geology.ts'));
const {sampleCinematicCamera}=await import(moduleURL('../lib/cinematography.ts'));

test('manual introduction is substantially shorter while all 56 scenes and interactions remain',()=>{
 const baselineWeights=[1.1,.7,.7,.65,.9,.95,.9,1.05,.85,.85,.8,.85,1,.8,1,.9,.8,.9,.85,.9,.85,1,.95,.95,.85,.85,.95,1.15,1,1,1,1,1,1];
 const original=baselineWeights.reduce((a,b)=>a+b,0),intro=storyScenes.slice(0,34).reduce((n,s)=>n+s.duration,0);
 assert.ok(intro<original*.4);assert.ok(intro>original*.3);
 assert.equal(storyScenes[33].duration,.12);
 assert.deepEqual(storyScenes.map(s=>s.id),Array.from({length:56},(_,i)=>i+1));
 assert.equal(storyScenes[21].hotspots.length,6);assert.equal(storyScenes[30].hotspots.length,6);
 assert.equal(storyScenes[51].duration,1.4);assert.equal(storyScenes[55].duration,1.3);
});

test('autoplay selects six highlights over exactly ten seconds then gives every story beat readable time',()=>{
 assert.equal(montageDurationSeconds,10);assert.equal(montageShots.length,6);
 assert.deepEqual(montageShots.map(s=>s.sceneIndex+1),[1,7,10,20,31,34]);
 assert.equal(showcaseFrame(9999).shot.sceneIndex,33);
 assert.equal(showcaseFrame(10000).shot.sceneIndex,34);assert.equal(showcaseFrame(10000).shot.montage,false);
 assert.deepEqual(storyShots.map(s=>s.sceneIndex+1),Array.from({length:22},(_,i)=>i+35));
 for(const shot of storyShots)assert.ok(shot.seconds>=8);
 assert.ok(showcaseDurationSeconds>=180&&showcaseDurationSeconds<=300);
 assert.equal(showcaseFrame(showcaseDurationSeconds*1000).complete,true);
 assert.equal(showcaseFrame(0).shot.sceneIndex,0);
});

test('city shots use seven distinct delivered environments and the feast differs from food preparation',()=>{
 assert.equal(new Set(storyScenes.slice(7,14).map(s=>s.asset)).size,7);
 assert.notEqual(storyScenes[21].asset,storyScenes[30].asset);
 for(const i of [7,8,9,10,11,12,13,21,30])assert.ok(fs.statSync(new URL('../public'+storyScenes[i].asset,import.meta.url)).size>1000);
 assert.notDeepEqual(storyScenes[21].hotspots.map(h=>h.position),storyScenes[30].hotspots.map(h=>h.position));
});

test('the entire final planet envelope stays inside desktop, portrait and ultrawide viewports throughout scene56',()=>{
 for(const aspect of [390/844,700/900,1280/800,2560/1080])for(const progress of [0,.18,.5,.82,1]){
  const pose=sampleCinematicCamera(55,progress,aspect<.8,aspect),camera=new PerspectiveCamera(42,aspect,.05,200);
  camera.position.fromArray(pose.position);camera.lookAt(...pose.target);camera.updateMatrixWorld();
  for(let i=0;i<1000;i++){
   const y=1-2*(i+.5)/1000,r=Math.sqrt(1-y*y),theta=i*2.399963229728653;
   const point=new Vector3(1.25+planetEnvelopeRadius*r*Math.cos(theta),.1+planetEnvelopeRadius*y,planetEnvelopeRadius*r*Math.sin(theta)).project(camera);
   assert.ok(Math.abs(point.x)<.9&&Math.abs(point.y)<.9,`${aspect}, p${progress}: ${point.x},${point.y}`);
  }
  assert.ok(finalPlanetFraming(aspect).distance>planetEnvelopeRadius);
 }
});

test('asymmetric surface crystals are stable normalized clusters within the framed planet envelope',()=>{
 const clusters=crystalClusters();assert.equal(clusters.length,260);assert.deepEqual(clusters,crystalClusters());
 for(const c of clusters){assert.ok(Math.abs(Math.hypot(...c.direction)-1)<1e-12);assert.ok(c.height>=.018&&c.height<=.07);assert.ok(2.018+c.height<planetEnvelopeRadius);}
 assert.ok(clusters.some(c=>c.bronze));assert.ok(clusters.some(c=>!c.bronze));
});
