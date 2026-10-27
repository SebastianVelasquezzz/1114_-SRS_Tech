import {COMPONENTS,ORDER} from "./catalog.js";
export const getPart=(key,id)=>COMPONENTS[key].find(p=>p.id===id)||COMPONENTS[key][0];
export const totalOf=s=>ORDER.reduce((n,k)=>n+getPart(k,s[k]).price,0);
export function issuesOf(s){
 const cpu=getPart("cpu",s.cpu),gpu=getPart("gpu",s.gpu),board=getPart("board",s.board),ram=getPart("ram",s.ram),psu=getPart("psu",s.psu),pcCase=getPart("case",s.case),cooler=getPart("cooler",s.cooler),issues=[];
 if(cpu.socket!==board.socket)issues.push(`Socket incompatible: CPU ${cpu.socket}, placa ${board.socket}.`);
 if(ram.type!==board.ramType)issues.push(`RAM incompatible: la placa requiere ${board.ramType}, seleccionaste ${ram.type}.`);
 if(gpu.length>board.gpuMax)issues.push(`La GPU supera el límite de longitud declarado para la placa/caja.`);
 if(gpu.length>pcCase.gpuMax)issues.push(`GPU de ${gpu.length} mm; gabinete admite ${pcCase.gpuMax} mm.`);
 const draw=cpu.tdp+gpu.tdp+120, recommended=Math.ceil(draw*1.35/50)*50;
 if(psu.watts<recommended)issues.push(`Fuente corta: consumo estimado ${draw} W; se recomienda ${recommended} W o más.`);
 if(cooler.tdpMax<cpu.tdp)issues.push(`Refrigeración dimensionada para ${cooler.tdpMax} W; CPU declara ${cpu.tdp} W.`);
 return issues;
}
export const compatible=s=>issuesOf(s).length===0;
export function optionsFor(key,s){return COMPONENTS[key].filter(p=>compatible({...s,[key]:p.id}));}
export function bestBuild(budget){
 let best=null;
 const lists=ORDER.map(k=>COMPONENTS[k]);
 for(const cpu of lists[0])for(const gpu of lists[1])for(const board of lists[2])for(const ram of lists[3])
 for(const storage of lists[4])for(const psu of lists[5])for(const pcCase of lists[6])for(const cooler of lists[7]){
  const selection={cpu:cpu.id,gpu:gpu.id,board:board.id,ram:ram.id,storage:storage.id,psu:psu.id,case:pcCase.id,cooler:cooler.id};
  const total=totalOf(selection);if(total>budget||!compatible(selection))continue;
  const score=cpu.tier*2+gpu.tier*4+board.tier+ram.tier*1.5+storage.tier+psu.tier*.6+pcCase.tier*.5+cooler.tier*.4;
  if(!best||score>best.score||(score===best.score&&total>best.total))best={selection,total,score};
 }
 if(best)return {...best,insufficient:false};
 let cheapest=null;
 for(const cpu of lists[0])for(const gpu of lists[1])for(const board of lists[2])for(const ram of lists[3])
 for(const storage of lists[4])for(const psu of lists[5])for(const pcCase of lists[6])for(const cooler of lists[7]){
  const selection={cpu:cpu.id,gpu:gpu.id,board:board.id,ram:ram.id,storage:storage.id,psu:psu.id,case:pcCase.id,cooler:cooler.id};
  const total=totalOf(selection);if(compatible(selection)&&(!cheapest||total<cheapest.total))cheapest={selection,total};
 }
 return {...cheapest,score:0,insufficient:true};
}
