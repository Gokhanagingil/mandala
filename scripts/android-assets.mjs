// Dedicated module-worker requests do not reliably use WebViewAssetLoader.
// Bundle the unchanged engine/AI into an in-memory worker for Android only.
import {cpSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {Script} from 'node:vm';
const out='android/generated/www';
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
cpSync('dist',out,{recursive:true});
const modules=['engine.js','ai.js','ai-worker.js'];
const worker=modules.map(file=>readFileSync('dist/'+file,'utf8')
 .replace(/^import .+ from ['"].+['"];\s*$/gm,'')
 .replace(/^export /gm,'')).join('\n');
new Script(worker,{filename:'android-ai-worker.js'});
const host='// Generated from the bundled game modules. No network requests.\n'+
 '(()=>{const url=URL.createObjectURL(new Blob(['+JSON.stringify(worker)+'],{type:"text/javascript"}));'+
 'Object.defineProperty(globalThis,"MangalaAndroid",{value:Object.freeze({createAiWorker:()=>new Worker(url)})});})();\n';
new Script(host,{filename:'android-host.js'});
writeFileSync(out+'/android-host.js',host);
const original="new Worker(new URL('./ai-worker.js',import.meta.url),{type:'module'})";
let app=readFileSync(out+'/app.js','utf8');
if(app.split(original).length!==2)throw Error('Review Android worker adapter: expected one worker constructor');
app=app.replace(original,'MangalaAndroid.createAiWorker()');
writeFileSync(out+'/app.js',app);
let html=readFileSync(out+'/index.html','utf8');
if(!html.includes('<script type="module"'))throw Error('Missing app module');
html=html.replace('<script type="module"','<script src="./android-host.js"></script><script type="module"');
writeFileSync(out+'/index.html',html);
console.log('Bundled Android assets and offline AI worker ('+worker.length+' bytes)');
