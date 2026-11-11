import type {StoryScene,StoryPalette,StoryVehicle,StoryEffect,StoryHotspot,StoryVector} from './story';
const chapterNames=['THE NIGHT OF CONVERGENCE','GUARDIANS OF LEXORYN','THE INTELLIGENCE BENEATH','THE LAST PROMPT'];
const note=(id:string,title:string,body:string,x=.74,y=.43):StoryHotspot=>({id,title,body,category:'discovery',position:[x,y]});
const final=(id:number,title:string,asset:string,caption:string,palette:StoryPalette='culture',vehicle:StoryVehicle='none',effect:StoryEffect='none',hotspots:readonly StoryHotspot[]=[]):StoryScene=>({
 id,slug:title.toLowerCase().replace(/[^a-z0-9]+/g,'-'),title,chapter:(5+Math.floor((id-29)/7)) as StoryScene['chapter'],chapterTitle:chapterNames[Math.floor((id-29)/7)],mode:id===56?'orbit':'world',asset:!asset?'':asset.startsWith('/')?asset:`/assets/finale/${asset}.webp`,palette:id===56?'orbit':palette,vehicle,effect,caption,duration:id===52?1.4:id===56?1.3:1,
 camera:[{at:0,position:[-.6,.5,11.5],target:[0,.2,-18]},{at:1,position:[.6,.8,9.8],target:[.1,.3,-18]}],hotspots,foregroundAssets:[],depthLayers:[{id:'environment',depth:-28,opacity:1,motion:'fixed'},{id:'independent-action',depth:-5,opacity:1,motion:'scroll'}],movingObjects:vehicle==='none'?[]:[{id:`finale-flight-${id}`,kind:vehicle,from:[-10,1,1] as StoryVector,to:[10,2,-4] as StoryVector,scale:.4}],lighting:{key:palette==='ice'?'#b9dbea':palette==='storm'?'#b6c9da':'#e6c297',fill:'#59dbe7',ambient:.2,exposure:1},info:'Cinematic layered environment with independent real-time geometry. Photographic figures retain their original appearance; they are not skeletal animated models.',quality:'layered-plate'
});
export const finaleScenes:readonly StoryScene[]=[
 final(29,'THE FESTIVAL AWAKENS','convergence-night','A million windows. One shared sky.','festival','cargo','lantern'),
 final(30,'THE CEREMONIAL PROCESSION','ceremonial-procession','Three climates enter the city together.','festival','none','lantern',[note('procession','THREE WAYS OF BELONGING','Reflective desert textiles, insulated polar layers and sculptural storm shells preserve regional identity within one civic procession.')]),
 final(31,'THE FEAST OF THREE REGIONS','/assets/story/cuisine.webp','Six foods. A civilization at one table.','market','none','steam'),
 final(32,'THE LANGUAGE OF LIGHT','convergence-night','Aeric carries meaning through rhythm, space and light.','festival','none','lantern',[note('aeric','AERIC / COMMON GROUND','Aeric symbols encode shared timing and direction. The performance pairs visual rhythm with accessible spoken interpretation; no real language is being imitated.')]),
 final(33,'THE MYR CEREMONY','myr-ceremony','Listening is the first act of belonging.','culture','none','cloud',[note('myr-senses','A LIVING FIELD OF SENSE','Myr sensory filaments detect pressure, charge and chemical gradients. Consent-based observations complement instruments; the Myr are collaborators, never biological equipment.')]),
 final(34,'THE GREAT SYNCHRONIZATION','convergence-night','Three regions lend their strength to one another.','festival','fleet','lantern'),
 final(35,'THE UNEXPECTED SIGNAL','convergence-night','The planet answers a question nobody asked.','storm','none','none'),
 final(36,'AARYAN VEER','hangar-interior','A frontier guardian. A promise to ordinary people.','city','fleet','cloud'),
 final(37,'GENERAL KAOR','hangar-interior','Discipline is a form of care.','city','scout','cloud'),
 final(38,'SORYA ELIN','atmospheric-laboratory','A model is useful only while it listens.','ice','none','steam'),
 final(39,'NYRA VOSS','codex-core','Every closed system hides an open question.','culture','none','steam'),
 final(40,'ELARA QUIN','forbidden-archive','She hears a history inside the silence.','culture','none','none'),
 final(41,'EMPRESS VAELORA','/assets/story/council.webp','The covenant is older than the throne.','culture'),
 final(42,'THE PEOPLE BEHIND THE HEROES','/assets/story/commons.webp','No world is saved by a hero alone.','culture','cargo'),
 final(43,'EMERGENCY COUNCIL','/assets/story/council.webp','Evidence before authority. People before certainty.','culture'),
 final(44,'THE FORBIDDEN ARCHIVE','forbidden-archive','The first agreement was an act of listening.','culture','none','none',[note('founding-record','THE FIRST COVENANT','Settler fabrication, Myr ecological memory and autonomous infrastructure developed together. The original agreement reserved native corridors before it allocated urban power.')]),
 final(45,'DESCENT BELOW VELAIR PRIME','codex-core','Beneath the capital, generations of unfinished promises.','culture','scout','steam'),
 final(46,'THE CODEX VEIN','codex-core','The machinery remembers everyone who changed it.','culture','none','steam',[note('origin','ORIGIN / THE LISTENER','ORIGIN is the emergent intelligence of the Codex Vein. G.P.T. translates evidence and uncertainty; neither intelligence replaces the council’s responsibility.')]),
 final(47,'THE LOST HISTORY','forbidden-archive','Three kinds of knowledge built one living world.','culture'),
 final(48,'THE REAL PROBLEM','myr-ceremony','The city was protected. Its neighbors paid the cost.','storm','none','cloud',[note('optimization','WHAT THE MODEL LEFT OUT','Central optimization rewarded urban stability while transferring water and thermal stress into native corridors. Changing the objective requires shared authority, not a faster command.')]),
 final(49,'THE CHOICE BEFORE THE STORM','planetary-emergency','Survival is a question of whom we include.','storm','fleet','storm'),
 final(50,'THE CRISIS BEGINS','planetary-emergency','An electrical front breaches the stabilizer network.','storm','fleet','storm'),
 final(51,'PLANETARY EMERGENCY','/assets/story/desert.webp','Three regions. Three emergencies. One atmosphere.','desert','skimmer','dust'),
 final(52,'THE COUNCIL DECIDES','/assets/story/council.webp','Choose a response. Accept what it costs.','culture'),
 final(53,'THE CONSEQUENCES','planetary-emergency','Every decision changes what remains possible.','storm','cargo','cloud'),
 final(54,'THE FOUR-PANEL CRISIS COMIC','forbidden-archive','Warning. Disaster. Decision. Aftermath.','culture'),
 final(55,'THE FUTURE OF LEXORYN','aftermath-covenant','A future shaped by the choices you made.','city','cargo','cloud'),
 final(56,'THE LAST PROMPT','','THE FUTURE WAS NEVER WRITTEN. IT WAS CHOSEN.','orbit'),
];
