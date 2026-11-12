import fs from 'node:fs';
import {moduleURL} from '../tests/load-module.mjs';
const {storyScenes}=await import(moduleURL('../data/story.ts'));
const {dynastyMedia,dynastySceneAssets}=await import(moduleURL('../data/dynasty-runtime.ts'));
const {characters}=await import(moduleURL('../data/characters.ts'));
const file=new URL('../data/dynasty-audit.json',import.meta.url),audit=JSON.parse(fs.readFileSync(file,'utf8'));
for(const row of audit.scenes){
 const scene=storyScenes[row.scene-1];row.final_scene_title=scene.title;
 const src=dynastySceneAssets[row.scene],media=Object.values(dynastyMedia).find(a=>a.src===src);
 if(media){row.final_selected_asset=src;row.final_actual_native_dimensions=[media.width,media.height];row.selection_status='Original alien artwork integrated; source inspected; browser acceptance pending';row.updated_canon_match='New alien-specific source; see generation record';row.new_image_required=false;}
 if(row.scene>=36&&row.scene<=41){const c=characters[row.scene-36];row.final_character={id:c.id,species:c.species,asset:c.asset,dimensions:[c.assetWidth,c.assetHeight],portrait:c.portraitAsset??null,status:c.visualStatus};}
 row.final_inspection_assets=Object.values(dynastyMedia).filter(a=>a.inspectionId&&scene.hotspots.some(h=>h.id===a.inspectionId)).map(a=>({id:a.inspectionId,src:a.src,dimensions:[a.width,a.height],alpha:a.alpha}));
 if([53,54,55].includes(row.scene)){row.final_conditional_assets=Object.values(dynastyMedia).filter(a=>a.outcomeId||a.src.endsWith('/crisis-comic-strip.webp')).map(a=>({src:a.src,dimensions:[a.width,a.height],outcome:a.outcomeId??'three-panel-strip'}));row.new_image_required=false;row.selection_status='New conditional comic and ending sources integrated; browser acceptance pending';}
 if(row.scene===42)row.final_supporting_cast=characters.filter(c=>!c.hero).map(c=>({id:c.id,species:c.species,asset:c.asset,portrait:c.portraitAsset??null}));
 if(row.scene===49)row.animation_method='Layered storm balcony + independent3D fleet, rain and storm effects; reused Codex machinery removed';
 row.visual_validation='Source inspection recorded; Alien Dynasty browser acceptance pending';
}
audit.integrated_generated_sources=Object.values(dynastyMedia).length;
audit.browser_acceptance='Not completed: prior localhost automatic approval gate remains unresolved';
const temporary=new URL('../data/dynasty-audit.json.tmp',import.meta.url);fs.writeFileSync(temporary,JSON.stringify(audit,null,2)+'\n');fs.renameSync(temporary,file);
console.log(JSON.stringify({scenes:audit.scenes.length,generatedSources:audit.integrated_generated_sources,characters:characters.length,pendingCharacterBodies:characters.filter(c=>c.visualStatus!=='current').map(c=>c.id),pendingPortraits:characters.filter(c=>c.species!=='planetary-intelligence'&&!c.portraitAsset).map(c=>c.id)}));
