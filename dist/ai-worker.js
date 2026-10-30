import {chooseMove} from './ai.js';
self.onmessage=({data})=>{try {self.postMessage({id:data.id,...chooseMove(data.state,data.level,data.style)});}catch {self.postMessage({id:data.id,error:true});}};
