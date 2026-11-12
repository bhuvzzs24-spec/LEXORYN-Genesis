import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {moduleURL} from './load-module.mjs';
const {storyScenes,storyChapters,cuisineHotspots,attireHotspots,everydayHotspots}=await import(moduleURL('../data/story.ts'));
const {getStoryFrame,progressForScene,sampleCamera,storyBounds,totalStoryDuration}=await import(moduleURL('../lib/story.ts'));

test('the complete 56-beat story is ordered, distinct and divided into eight chapters',()=>{
 assert.equal(storyScenes.length,56);
 assert.deepEqual(storyScenes.map(s=>s.id),Array.from({length:56},(_,i)=>i+1));
 assert.equal(new Set(storyScenes.map(s=>s.slug)).size,56);
 assert.equal(storyChapters.length,8);
 for(const c of storyChapters)assert.equal(storyScenes.filter(s=>s.chapter===c.id).length,7);
 assert.ok(totalStoryDuration>=30&&totalStoryDuration<=38);
 assert.equal(storyScenes[0].mode,'orbit');assert.equal(storyScenes[14].mode,'orbit');
 assert.match(storyScenes[27].title,/PREPARING FOR CONVERGENCE/);
});
test('all timing intervals meet without gaps and every scene navigation target resolves correctly',()=>{
 assert.equal(storyBounds[0].start,0);assert.equal(storyBounds.at(-1).end,1);
 storyBounds.forEach((b,i)=>{assert.ok(b.end>b.start);if(i)assert.ok(Math.abs(b.start-storyBounds[i-1].end)<1e-12);assert.equal(getStoryFrame(progressForScene(i)).sceneIndex,i);});
 assert.equal(getStoryFrame(-1).sceneIndex,0);assert.equal(getStoryFrame(2).sceneIndex,55);assert.equal(getStoryFrame(1).localProgress,1);assert.equal(getStoryFrame(NaN).sceneIndex,0);
});
test('camera and story sampling are finite, deterministic and reversible at each scroll position',()=>{
 const samples=Array.from({length:301},(_,i)=>i/300);
 for(const scene of storyScenes){
  const forward=samples.map(p=>sampleCamera(scene,p));
  for(let i=samples.length-1;i>=0;i--){const result=sampleCamera(scene,samples[i]);assert.deepEqual(result,forward[i]);for(const n of [...result.position,...result.target])assert.ok(Number.isFinite(n));}
  for(let i=1;i<forward.length;i++){const a=forward[i-1].position,b=forward[i].position;assert.ok(Math.hypot(...b.map((n,k)=>n-a[k]))<.2,scene.title);}
 }
 const f=samples.map(p=>getStoryFrame(p));
 samples.toReversed().forEach((p,i)=>assert.deepEqual(getStoryFrame(p),f[f.length-1-i]));
});
test('cuisine, attire, survival equipment and regional purpose remain explicit and concise',()=>{
 assert.deepEqual(cuisineHotspots.map(h=>h.title),['AETHER GRAIN','CRYO BLOOM','SKY KELP','SOLAR FRUIT','MISTWATER BROTH','LUMIFUNGUS']);
 assert.equal(attireHotspots.length,6);assert.equal(everydayHotspots.length,10);
 assert.deepEqual(storyScenes[14].hotspots.map(h=>h.id),['pyravar','cryonth','aerion']);
 assert.deepEqual(storyScenes[20].hotspots.map(h=>h.id),['pyravar','cryonth','aerion']);
 for(const scene of storyScenes){
  assert.ok(scene.caption.trim().split(/\s+/).length<=12,scene.title);
  assert.equal(new Set(scene.hotspots.map(h=>h.id)).size,scene.hotspots.length,scene.title);
  for(const h of scene.hotspots){assert.ok(h.position.every(v=>v>=0&&v<=1));assert.ok(h.body.trim().split(/\s+/).length<=30,h.id);if(h.detailAsset)assert.equal(h.detailQuality,'concept-reference');}
 }
 assert.equal(storyScenes[23].asset,'/assets/story/objects.webp');
 assert.match(storyScenes[23].info,/not rotatable 3D/);
 assert.equal(storyScenes[4].movingObjects.length,3);
 assert.equal(new Set(storyScenes[4].movingObjects.map(o=>o.from[2])).size,3);
});


test('all cinematic media slots are real nonempty optimized files with smaller mobile variants',()=>{
 const media=JSON.parse(fs.readFileSync(new URL('../data/story-media.json',import.meta.url),'utf8')).generated;
 assert.equal(Object.keys(media).length,14);
 for(const asset of Object.values(media)){
  assert.equal(asset.kind,'generated');assert.ok(asset.width>=1600&&asset.height>=900);
  for(const url of [asset.src,asset.mobileSrc]){assert.match(url,/^\/assets\/story\/[a-z-]+\.webp$/);assert.ok(fs.statSync(new URL('../public'+url,import.meta.url)).size>1000);}
  assert.ok(fs.statSync(new URL('../public'+asset.mobileSrc,import.meta.url)).size<fs.statSync(new URL('../public'+asset.src,import.meta.url)).size);
 }
 for(const scene of storyScenes.filter(s=>s.asset.startsWith('/assets/story/')))assert.ok(Object.values(media).some(a=>a.src===scene.asset),scene.title);
 const distribution=JSON.parse(fs.readFileSync(new URL('../data/story-distribution.json',import.meta.url),'utf8'));
 if(distribution.includeProvidedDetails)for(const scene of storyScenes)for(const h of scene.hotspots)if(h.detailAsset)assert.ok(fs.existsSync(new URL('../public'+h.detailAsset,import.meta.url)),h.id);
});
