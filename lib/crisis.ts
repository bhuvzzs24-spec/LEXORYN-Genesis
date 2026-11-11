import {crisisConfig,resourceKeys,type CrisisConfig,type CrisisOutcome,type Resources} from '@/data/crisis';
export interface CrisisState {configId:string;history:readonly string[];resources:Resources;}
const clamp=(n:number)=>Math.max(0,Math.min(100,n));
export function initialCrisis(config:CrisisConfig=crisisConfig):CrisisState{return {configId:config.id,history:[],resources:{...config.initial}};}
/** A decision can be used once. Order matters through sequential clamping and timed hazards. */
export function applyDecision(state:CrisisState,id:string,config:CrisisConfig=crisisConfig):CrisisState{
 if(state.configId!==config.id||state.history.length>=config.rounds||state.history.includes(id))return state;
 const decision=config.decisions.find(d=>d.id===id);if(!decision)return state;
 const hazard=config.hazards[state.history.length]??{};
 const resources=Object.fromEntries(resourceKeys.map(k=>[k,clamp(state.resources[k]+(decision.delta[k]??0)+(hazard[k]??0))])) as unknown as Resources;
 return {configId:config.id,history:[...state.history,id],resources};
}
export function crisisOutcome(state:CrisisState,config:CrisisConfig=crisisConfig):CrisisOutcome|null{
 if(state.history.length<config.rounds)return null;
 return config.outcomes.find(o=>resourceKeys.every(k=>state.resources[k]>=(o.requirements[k]??0)&&state.resources[k]<=(o.maxima?.[k]??100)))??config.outcomes.find(o=>o.id===config.fallbackOutcome)??null;
}
export function restoreCrisis(raw:unknown,config:CrisisConfig=crisisConfig):CrisisState{
 const start=initialCrisis(config);if(!raw||typeof raw!=='object')return start;
 const saved=raw as Partial<CrisisState>;if(saved.configId!==config.id||!Array.isArray(saved.history)||saved.history.length>config.rounds)return start;
 // Replay only valid decision IDs. Never trust resource values supplied by localStorage.
 if(saved.history.some((id,i,all)=>typeof id!=='string'||!config.decisions.some(d=>d.id===id)||all.indexOf(id)!==i))return start;
 return saved.history.reduce((s,id)=>applyDecision(s,id,config),start);
}
export function simulateCrisis(decisions:readonly string[],config:CrisisConfig=crisisConfig){return decisions.reduce((s,id)=>applyDecision(s,id,config),initialCrisis(config));}
