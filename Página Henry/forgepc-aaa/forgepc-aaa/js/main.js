import {ORDER,DEFAULT_BUDGET} from "./catalog.js";
import {bestBuild,getPart,totalOf,issuesOf} from "./compatibility.js";
import {PCScene} from "./scene3d.js";
import {ForgeUI} from "./ui.js";
const state={budget:DEFAULT_BUDGET,mode:"auto",selection:null};
const scene=new PCScene(document.getElementById("viewport"));let ui;
const partsFor=s=>Object.fromEntries(ORDER.map(k=>[k,getPart(k,s[k])]));
function chooseAuto(){state.selection=bestBuild(state.budget).selection}
function refresh(){const parts=partsFor(state.selection),total=totalOf(state.selection),issues=issuesOf(state.selection);ui.render({budget:state.budget,selection:state.selection,parts,total,issues,insufficient:total>state.budget,mode:state.mode});scene.rebuild(state.selection,parts)}
function onBudget(n){state.budget=n;if(state.mode==="auto")chooseAuto();refresh()}
function onMode(mode){state.mode=mode;if(mode==="auto")chooseAuto();refresh()}
function onSelect(key,id){if(state.mode!=="manual")return;state.selection={...state.selection,[key]:id};refresh()}
function reset(){state.budget=DEFAULT_BUDGET;state.mode="auto";document.getElementById("budget").value=DEFAULT_BUDGET;document.getElementById("range").value=DEFAULT_BUDGET;chooseAuto();ui.setMode("auto");refresh();ui.toast("Configuración reiniciada.")}
ui=new ForgeUI({budget:onBudget,mode:onMode,select:onSelect,reset});chooseAuto();refresh();
const rotate=document.getElementById("rotate");rotate.onclick=()=>{scene.controls.autoRotate=!scene.controls.autoRotate;rotate.textContent=scene.controls.autoRotate?"Ⅱ PAUSAR GIRO":"▶ REANUDAR GIRO"};document.getElementById("camera-reset").onclick=()=>scene.resetCamera();
document.addEventListener("visibilitychange",()=>{if(document.hidden)scene.controls.autoRotate=false});window.addEventListener("beforeunload",()=>scene.dispose());
