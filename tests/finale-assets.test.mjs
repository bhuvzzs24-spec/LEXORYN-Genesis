import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {moduleURL} from './load-module.mjs';
const {storyScenes}=await import(moduleURL('../data/story.ts'));
const {crisisConfig}=await import(moduleURL('../data/crisis.ts'));
const media=JSON.parse(fs.readFileSync(new URL('../data/finale-media.json',import.meta.url),'utf8'));
test('every finale environment, outcome, comic and mobile delivery is an actual optimized original asset',()=>{
 assert.equal(Object.keys(media).length,12);
 for(const asset of Object.values(media)){
  assert.equal(asset.kind,'generated');assert.ok(asset.width>=1600);assert.ok(asset.height>=700);
  for(const url of [asset.src,asset.mobileSrc]){assert.ok(url);const p=new URL('../public'+url,import.meta.url);const b=fs.readFileSync(p);assert.ok(b.length>10000,url);assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');}
  assert.ok(fs.statSync(new URL('../public'+asset.mobileSrc,import.meta.url)).size<fs.statSync(new URL('../public'+asset.src,import.meta.url)).size);
 }
 for(const scene of storyScenes.slice(28).filter(s=>s.asset)){assert.ok(fs.existsSync(new URL('../public'+scene.asset,import.meta.url)),scene.title);}
 for(const end of crisisConfig.outcomes){assert.ok(media[end.asset]);assert.ok(media[end.comicAftermath]);}
 assert.equal(media['crisis-comic-strip'].width/media['crisis-comic-strip'].height,3);
 assert.ok(fs.existsSync(new URL('../public'+crisisConfig.comic.strip,import.meta.url)));
 assert.equal(JSON.parse(fs.readFileSync(new URL('../data/story-distribution.json',import.meta.url),'utf8')).includeProvidedDetails,false);
});
