import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
export class PCScene{
 constructor(el){
  this.el=el;this.scene=new THREE.Scene();this.scene.fog=new THREE.FogExp2(0x090c17,.045);
  this.camera=new THREE.PerspectiveCamera(36,1,.1,100);this.camera.position.set(5.5,3.8,7.4);
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"high-performance"});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.2;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;el.appendChild(this.renderer.domElement);
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,1.5,0);this.controls.enableDamping=true;this.controls.dampingFactor=.055;this.controls.autoRotate=true;this.controls.autoRotateSpeed=.55;this.controls.minDistance=4.1;this.controls.maxDistance=12;this.controls.maxPolarAngle=Math.PI*.83;
  this.scene.add(new THREE.HemisphereLight(0xcbdcff,0x17101f,2.2));
  const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(5,8,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);this.scene.add(key);
  const rim=new THREE.PointLight(0x855cff,38,12);rim.position.set(-3,3.6,-2.5);this.scene.add(rim);
  const cyan=new THREE.PointLight(0x28dfff,24,10);cyan.position.set(3,2.8,4);this.scene.add(cyan);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(7,64),new THREE.MeshStandardMaterial({color:0x0b1020,roughness:.8,metalness:.15}));floor.rotation.x=-Math.PI/2;floor.position.y=-.04;floor.receiveShadow=true;this.scene.add(floor);
  const grid=new THREE.GridHelper(14,28,0x3c3266,0x18263b);grid.position.y=-.025;this.scene.add(grid);
  this.pc=new THREE.Group();this.scene.add(this.pc);this.base=new THREE.Group();this.dynamic=new THREE.Group();this.pc.add(this.base,this.dynamic);
  this.m={dark:this.mat(0x111622,.72,.31),edge:this.mat(0x333b50,.7,.28),glass:new THREE.MeshPhysicalMaterial({color:0x7eacd0,metalness:.1,roughness:.12,transparent:true,opacity:.13,transmission:.1,side:THREE.DoubleSide}),board:this.mat(0x12463b,.35,.6),metal:this.mat(0x8c99ab,.8,.25),black:this.mat(0x080b12,.3,.48)};
  this.buildCase();this.loader=new GLTFLoader();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(el);this.resize();this.running=true;this.animate();
 }
 mat(c,metal=.3,rough=.4){return new THREE.MeshStandardMaterial({color:c,metalness:metal,roughness:rough})}
 glow(c){return new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:1.5,metalness:.25,roughness:.3})}
 box(p,n,s,pos,m,cast=true){const o=new THREE.Mesh(new THREE.BoxGeometry(...s),m);o.name=n;o.position.set(...pos);o.castShadow=cast;o.receiveShadow=true;p.add(o);return o}
 cylinder(p,n,r,l,pos,m,axis="z",seg=32){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,l,seg),m);o.name=n;o.position.set(...pos);if(axis==="z")o.rotation.x=Math.PI/2;if(axis==="x")o.rotation.z=Math.PI/2;o.castShadow=true;p.add(o);return o}
 buildCase(){const b=this.base,m=this.m;
  this.box(b,"case-shell",[2.25,3.35,1.65],[0,1.72,0],m.dark);this.box(b,"front-panel",[2.28,3.3,.08],[0,1.72,.86],m.edge);
  this.box(b,"front-glass",[2.12,3.12,.025],[0,1.72,.91],m.glass,false);this.box(b,"left-rail",[.08,3.35,1.72],[-1.16,1.72,0],m.edge);this.box(b,"right-rail",[.08,3.35,1.72],[1.16,1.72,0],m.edge);
  this.box(b,"top-rail",[2.3,.09,1.72],[0,3.42,0],m.edge);this.box(b,"bottom-rail",[2.3,.1,1.72],[0,.04,0],m.edge);this.box(b,"glass-side",[2.12,3.08,.025],[0,1.72,-.84],m.glass,false);
  for(const x of [-.78,.78])for(const z of [-.52,.52])this.box(b,"foot",[.35,.12,.3],[x,-.07,z],m.black);
  this.box(b,"motherboard-base",[1.35,2.15,.1],[-.28,1.78,-.57],m.board);this.box(b,"io-shield",[.25,.65,.13],[-.83,2.6,-.49],m.metal);
  this.strip=this.box(b,"front-rgb-strip",[.035,2.6,.035],[.96,1.72,.97],this.glow(0x8b5cf6),false);
  for(const y of [.2,3.2])for(const x of [-1.04,1.04])this.cylinder(b,"screw",.035,.018,[x,y,.93],m.metal,"z",12);
 }
 fan(parent,x,y,z,r,color){const g=new THREE.Group();g.position.set(x,y,z);const glow=this.glow(color);this.cylinder(g,"fan-ring",r,.06,[0,0,0],glow,"z",36);this.cylinder(g,"fan-hub",r*.22,.075,[0,0,.04],this.m.metal,"z",24);for(let i=0;i<7;i++){const blade=this.box(g,"blade",[r*.11,r*.62,.022],[0,r*.39,.045],this.m.metal,false);blade.rotation.z=i*Math.PI*2/7}parent.add(g)}
 clear(){while(this.dynamic.children.length){const o=this.dynamic.children[0];this.dynamic.remove(o);o.traverse(c=>{if(c.geometry)c.geometry.dispose()})}}
 rebuild(selection,p){
  this.clear();const gpu=p.gpu,ram=p.ram,cooler=p.cooler,color=gpu.integrated?0x8b5cf6:gpu.tier>=3?0x65eaff:gpu.tier===2?0x9b7bff:0x5cdbff,glow=this.glow(color),accent=this.mat(color,.65,.25);
  const length=gpu.integrated?.5:gpu.length>=320?1.62:gpu.length>=275?1.38:1.05,g=new THREE.Group();g.position.set(.15,1.48,-.25);
  this.box(g,"gpu-body",[length,.32,.72],[0,0,0],this.m.black);this.box(g,"gpu-backplate",[length*.94,.055,.66],[0,.19,0],accent);this.box(g,"gpu-led",[length*.75,.025,.025],[0,.225,.37],glow,false);
  const count=gpu.integrated?0:gpu.tier>=2?2:1;for(let i=0;i<count;i++){const x=(i-(count-1)/2)*.48;this.cylinder(g,"gpu-fan",.13,.045,[x,0,.39],glow,"z",32);this.cylinder(g,"gpu-hub",.045,.05,[x,0,.42],this.m.metal,"z",20)}this.dynamic.add(g);
  const cg=new THREE.Group();cg.position.set(-.48,2.35,-.48);this.box(cg,"cpu-block",[.48,.34,.46],[0,0,0],this.m.metal);
  if(cooler.id==="cooler-aio"){this.cylinder(cg,"aio-pump",.19,.18,[0,.2,0],glow,"y",32);for(let i=0;i<2;i++){const t=new THREE.Mesh(new THREE.TorusGeometry(.12,.025,8,24,Math.PI),this.m.black);t.position.set(i?-.22:.22,.28,-.04);t.rotation.z=i?Math.PI/2:-Math.PI/2;cg.add(t)}}
  else{this.box(cg,"cooler-tower",[.38,.62,.38],[0,.34,0],accent);for(let i=0;i<5;i++)this.box(cg,"fin",[.42,.025,.42],[0,.12+i*.1,0],this.m.metal,false);this.cylinder(cg,"cooler-fan",.15,.04,[0,.34,.22],glow,"z",32)}this.dynamic.add(cg);
  const sticks=ram.capacity>=64?4:2;for(let i=0;i<sticks;i++){const x=-.1+i*.14;this.box(this.dynamic,"ram-stick",[.07,.58,.09],[x,2.27,-.48],accent);this.box(this.dynamic,"ram-led",[.05,.025,.035],[x,2.57,-.43],glow,false)}
  this.box(this.dynamic,"ssd",[.55,.12,.18],[-.56,1.35,-.42],accent);this.box(this.dynamic,"psu",[.95,.43,.78],[.25,.43,-.25],this.m.black);this.box(this.dynamic,"psu-label",[.5,.02,.025],[.25,.66,.15],glow,false);
  this.fan(this.dynamic,-.53,2.75,.97,.31,color);this.fan(this.dynamic,.53,2.75,.97,.31,color);this.fan(this.dynamic,0,1.9,.97,.31,color);if(gpu.tier>=2)this.fan(this.dynamic,.65,3.05,-.45,.2,color);
  this.strip.material.color.setHex(color);this.strip.material.emissive.setHex(color);this.strip.material.emissiveIntensity=gpu.tier>=2?2.5:1.4;
 }
 async loadExternalModel(url){try{const gltf=await this.loader.loadAsync(url);this.scene.add(gltf.scene);return gltf.scene}catch(e){console.warn("GLB no cargado; se conserva el modelo procedural",e);return null}}
 resize(){const w=this.el.clientWidth||640,h=this.el.clientHeight||480;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix()}
 resetCamera(){this.camera.position.set(5.5,3.8,7.4);this.controls.target.set(0,1.5,0);this.controls.update()}
 animate=()=>{if(!this.running)return;requestAnimationFrame(this.animate);this.controls.update();this.renderer.render(this.scene,this.camera)}
 dispose(){this.running=false;this.resizeObserver.disconnect();this.controls.dispose();this.renderer.dispose()}
}
