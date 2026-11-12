import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {moduleURL} from './load-module.mjs';
const {characters,characterById}=await import(moduleURL('../data/characters.ts'));
const manifest=JSON.parse(fs.readFileSync(new URL('../data/character-assets.json',import.meta.url),'utf8'));

test('all15 revised cast identities have coherent wardrobe, relationships and crisis roles',()=>{
 assert.equal(characters.length,15);assert.equal(new Set(characters.map(c=>c.id)).size,15);
 assert.equal(characters.filter(c=>c.hero).length,6);
 for(const c of characters){
  assert.equal(characterById[c.id],c);
  for(const field of ['name','role','face','costume','footwear','environment','crisisRole'])assert.ok(c[field].trim().length>(field==='name'?2:8),`${c.id}.${field}`);
  assert.ok(c.relationships.length>=2);assert.ok(c.materials.length>=3);assert.ok(c.palette.length>=3);
  assert.ok(c.scenes.length>0&&c.scenes.every(id=>Number.isInteger(id)&&id>=29&&id<=56));
  if(c.portraitCrop){const r=c.portraitCrop;assert.ok(r.x>=0&&r.y>=0&&r.width>0&&r.height>0&&r.x+r.width<=1.000001&&r.y+r.height<=1.000001,c.id);}
 }
 assert.equal(characterById.origin.asset,'');assert.equal(characterById.origin.transparent,false);
 assert.match(characterById.origin.face,/No human face/);
});

test('character planes use real alpha WebP files with measured native dimensions and stable atlas cells',()=>{
 assert.equal(Object.keys(manifest).length,7);
 for(const a of Object.values(manifest)){
  const bytes=fs.readFileSync(new URL('../public'+a.asset,import.meta.url));
  assert.ok(bytes.length>10000);assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');
  assert.equal(bytes.subarray(12,16).toString(),'VP8X');assert.ok(bytes[20]&16,'actual alpha flag');
  assert.equal(bytes.readUIntLE(24,3)+1,a.width,a.asset);assert.equal(bytes.readUIntLE(27,3)+1,a.height,a.asset);
 }
 for(const c of characters.filter(c=>c.asset)){
  const bytes=fs.readFileSync(new URL('../public'+c.asset,import.meta.url));const a=Object.values(manifest).find(a=>a.asset===c.asset)??{width:bytes.readUIntLE(24,3)+1,height:bytes.readUIntLE(27,3)+1};
  assert.equal(c.assetWidth,a.width,c.id);assert.equal(c.assetHeight,a.height,c.id);assert.equal(c.transparent,true);
 }
 const support=['kito','bolt','thess','lysara','tork'].map(id=>characterById[id]);
 support.filter(c=>c.asset===manifest.supporting.asset).forEach(c=>{const i=['kito','bolt','thess','lysara','tork'].indexOf(c.id);assert.equal(c.asset,manifest.supporting.asset);assert.deepEqual(c.portraitCrop,{x:i/5,y:0,width:1/5,height:1});});
});
