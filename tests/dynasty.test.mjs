import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {moduleURL} from './load-module.mjs';
const {civilizationCanon,speciesDiets}=await import(moduleURL('../data/species.ts'));
const {characters,characterById}=await import(moduleURL('../data/characters.ts'));
const {dynastyMedia,dynastySceneAssets}=await import(moduleURL('../data/dynasty-runtime.ts'));
const {storyScenes}=await import(moduleURL('../data/story.ts'));
const {outcomeArtwork}=await import(moduleURL('../lib/finale.ts'));
test('alien hierarchy, minority humans and six species-specific diets are explicit',()=>{
 assert.equal(Object.values(civilizationCanon.population).reduce((n,v)=>n+v,0),100);
 assert.equal(civilizationCanon.population.vaelori,60);assert.equal(civilizationCanon.population.human,17);
 for(const id of ['kaor','vaelora','sorya','elara','lysara','veyr','rhaen'])assert.equal(characterById[id].species,'vaelori');
 for(const id of ['thess','mara'])assert.equal(characterById[id].species,'myr');
 for(const id of ['aaryan','nyra','kito','tork'])assert.equal(characterById[id].species,'human');
 assert.equal(characters.length,15);assert.equal(speciesDiets.length,6);
 for(const food of speciesDiets){assert.ok(food.vaelori&&food.myr&&food.human);assert.notEqual(food.human,food.myr);}
});
test('all integrated Dynasty assets are delivered files with honest metadata and valid scene links',()=>{
 for(const a of Object.values(dynastyMedia)){
  assert.ok(fs.statSync(new URL('../public'+a.src,import.meta.url)).size>1000,a.src);
  assert.ok(a.width>0&&a.height>0);assert.equal(a.kind,'generated');
  for(const id of a.sceneIds??[])assert.ok(id>=1&&id<=56);
 }
 assert.equal(storyScenes[48].title,'THE EVE OF COLLAPSE');assert.match(storyScenes[48].asset,/dynasty\/eve-of-collapse/);
});
test('conditional endings remain distinct and never become one default background for all outcomes',()=>{
 assert.equal(new Set(['aftermath-central','aftermath-regional','aftermath-covenant'].map(outcomeArtwork)).size,3);
 assert.equal(dynastySceneAssets[53],undefined);assert.equal(dynastySceneAssets[55],undefined);
});
