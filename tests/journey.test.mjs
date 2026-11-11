import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
async function load(path){const result=ts.transpileModule(fs.readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});return import('data:text/javascript;base64,'+Buffer.from(result.outputText).toString('base64'));}
const journey=await load('../lib/journey.ts');
const {regions,world}=await load('../data/world.ts');
const {assets}=await load('../data/assets.ts');
test('camera path is finite, continuous, monotonic in approach, and reaches arrival',()=>{let last=journey.sampleJourney(0);for(let i=1;i<=2000;i++){const next=journey.sampleJourney(i/2000);for(const value of [...next.position,...next.target])assert.ok(Number.isFinite(value));assert.ok(next.position[2]<=last.position[2]+1e-8);assert.ok(Math.hypot(...next.position.map((v,k)=>v-last.position[k]))<.2);last=next;}assert.equal(last.position[2],-21.5);assert.deepEqual(journey.sampleJourney(-1),journey.sampleJourney(0));assert.deepEqual(journey.sampleJourney(2),journey.sampleJourney(1));});
test('chapter boundaries and replay targets are valid',()=>{for(let i=0;i<5;i++)assert.equal(journey.chapterAt(journey.chapterProgress(i)),i);assert.equal(journey.chapterAt(1),4);});
test('three unique climate profiles and future phases preserve canon',()=>{assert.equal(new Set(regions.map(r=>r.id)).size,3);assert.equal(world.year,3186);assert.deepEqual(world.phases.map(p=>p.phase),[1,2,3,4]);for(const r of regions){assert.ok(r.infrastructure.length>1);assert.ok(r.position.length===3);}});
test('every provided/generated scene registry asset exists and has a web format',()=>{for(const a of Object.values(assets)){if(a.status==='missing')continue;assert.ok(fs.existsSync(new URL('../public'+a.src,import.meta.url)),a.src);assert.match(a.src,/\.webp$/);assert.ok(a.width>0&&a.height>0);}});
