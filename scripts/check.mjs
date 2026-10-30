import {readdirSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
for(const name of readdirSync('dist').filter(n=>n.endsWith('.js')))execFileSync(process.execPath,['--check','dist/'+name]);
const html=readFileSync('dist/index.html','utf8');
if(!html.includes('width=device-width'))throw Error('Missing responsive viewport');
console.log('Static modules and mobile viewport checked. No build dependencies.');
