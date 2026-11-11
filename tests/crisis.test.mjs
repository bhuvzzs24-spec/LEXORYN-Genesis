import {test} from 'node:test';
import assert from 'node:assert/strict';
import {moduleURL} from './load-module.mjs';
const {crisisConfig,resourceKeys}=await import(moduleURL('../data/crisis.ts'));
const {initialCrisis,applyDecision,restoreCrisis,crisisOutcome,simulateCrisis}=await import(moduleURL('../lib/crisis.ts'));
const {storyScenes}=await import(moduleURL('../data/story.ts'));
const {showcaseDurationSeconds,emergencyRegion}=await import(moduleURL('../lib/finale.ts'));
test('all56 scenes and eight chapters resolve; every new scene has spatial camera progression',()=>{
 assert.deepEqual(storyScenes.map(s=>s.id),Array.from({length:56},(_,i)=>i+1));
 for(const s of storyScenes.slice(28)){assert.equal(Math.ceil(s.id/7),s.chapter);assert.notDeepEqual(s.camera[0].position,s.camera.at(-1).position);}
 assert.equal(storyScenes.at(-1).mode,'orbit');assert.equal(storyScenes[30].hotspots.length,6);assert.ok(showcaseDurationSeconds>=180&&showcaseDurationSeconds<=300);
 assert.equal(new Set([.1,.5,.9].map(p=>emergencyRegion(p).asset)).size,3);
});
test('crisis transitions apply the selected typed consequence and timed hazard exactly',()=>{
 const start=initialCrisis();const next=applyDecision(start,'regional');
 for(const k of resourceKeys)assert.equal(next.resources[k],Math.max(0,Math.min(100,start.resources[k]+(crisisConfig.decisions[1].delta[k]??0)+(crisisConfig.hazards[0][k]??0))));
 assert.equal(start.history.length,0);assert.deepEqual(next.history,['regional']);
 assert.strictEqual(applyDecision(next,'regional'),next);assert.strictEqual(applyDecision(next,'invalid'),next);
 assert.equal(crisisOutcome(next),null);
});
test('all valid response permutations are deterministic, bounded and yield meaningful different endings',()=>{
 const outcomes=new Set();
 for(const a of crisisConfig.decisions)for(const b of crisisConfig.decisions)for(const c of crisisConfig.decisions){if(new Set([a.id,b.id,c.id]).size<3)continue;
  const ids=[a.id,b.id,c.id],s=simulateCrisis(ids);assert.deepEqual(s,simulateCrisis(ids));assert.equal(s.history.length,3);for(const v of Object.values(s.resources))assert.ok(v>=0&&v<=100);
  const end=crisisOutcome(s);assert.ok(end);outcomes.add(end.id);assert.strictEqual(applyDecision(s,'central'),s);assert.ok(end.comicAftermath);}
 assert.ok(outcomes.has('covenant'));assert.ok(outcomes.has('regional'));assert.ok(outcomes.has('shelter'));
 assert.equal(crisisOutcome(simulateCrisis(['regional','evacuate','covenant'])).id,'covenant');
 assert.equal(crisisOutcome(simulateCrisis(['central','regional','evacuate'])).id,'shelter');
});
test('saved decisions replay; tampered resources, duplicates and wrong card versions cannot alter outcomes',()=>{
 const s=simulateCrisis(['regional','covenant']);assert.deepEqual(restoreCrisis({...s,resources:{safety:10000}}),s);
 for(const raw of [null,{},'bad',{configId:'wrong',history:['central']},{configId:crisisConfig.id,history:['bad']},{configId:crisisConfig.id,history:['central','central']}])assert.deepEqual(restoreCrisis(raw),initialCrisis());
});
test('organizer crisis overrides change state/outcomes without changing React or animation code',()=>{
 const custom={...crisisConfig,id:'organizer-card',initial:{...crisisConfig.initial,safety:15},hazards:[{safety:-20},{safety:-20},{safety:-20}]};
 const state=simulateCrisis(['regional','covenant','central'],custom);assert.equal(state.configId,'organizer-card');assert.equal(crisisOutcome(state,custom).id,'fracture');
});
