import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../out/',import.meta.url));
const port=Number(process.env.PORT||4174);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webp':'image/webp','.png':'image/png','.ttf':'font/ttf','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url||'/','http://localhost').pathname);
  let file=path.resolve(root,'.'+pathname);
  if(file!==root.slice(0,-1)&&!file.startsWith(root)){res.writeHead(403);res.end('Forbidden');return;}
  let stat=await fs.promises.stat(file);
  if(stat.isDirectory()){file=path.join(file,'index.html');stat=await fs.promises.stat(file);}
  if(!stat.isFile())throw Error('Not a file');
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-cache'});
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Page not found. Run npm run build before npm start.');}
});
server.listen(port,'127.0.0.1',()=>console.log(`LEXORYN production preview: http://127.0.0.1:${port}`));
