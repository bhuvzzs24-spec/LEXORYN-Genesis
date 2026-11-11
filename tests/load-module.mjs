import fs from 'node:fs';
import ts from 'typescript';
const cache=new Map();
const root=new URL('../',import.meta.url);
/** Transpile the actual pure TypeScript dependency graph, including typed configuration. */
export function moduleURL(relative){return compile(new URL(relative,import.meta.url));}
function compile(url){
 if(cache.has(url.href))return cache.get(url.href);
 let code=url.pathname.endsWith('.json')?'export default '+fs.readFileSync(url,'utf8'):ts.transpileModule(fs.readFileSync(url,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 code=code.replace(/from\s+(['"])([^'"]+)\1/g,(all,quote,spec)=>{
  if(!spec.startsWith('.')&&!spec.startsWith('@/'))return all;
  const source=spec.startsWith('@/')?new URL(spec.slice(2),root):new URL(spec,url);
  if(!/\.(ts|json)$/.test(source.pathname))source.pathname+='.ts';
  return `from '${compile(source)}'`;
 });
 const result='data:text/javascript;base64,'+Buffer.from(code).toString('base64');cache.set(url.href,result);return result;
}
