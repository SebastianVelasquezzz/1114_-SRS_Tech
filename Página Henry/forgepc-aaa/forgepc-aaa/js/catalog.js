// Catálogo ilustrativo: reemplaza precios y especificaciones por datos verificados.
export const COMPONENTS={
 cpu:[
  {id:"cpu-5600g",name:"AMD Ryzen 5 5600G",price:520000,socket:"AM4",tdp:65,tier:1},
  {id:"cpu-5600",name:"AMD Ryzen 5 5600",price:480000,socket:"AM4",tdp:65,tier:2},
  {id:"cpu-7600",name:"AMD Ryzen 5 7600",price:850000,socket:"AM5",tdp:65,tier:3},
  {id:"cpu-7700",name:"AMD Ryzen 7 7700",price:1250000,socket:"AM5",tdp:65,tier:4}],
 gpu:[
  {id:"gpu-integrated",name:"Gráficos integrados",price:0,vram:0,length:0,tdp:0,tier:0,integrated:true},
  {id:"gpu-entry",name:"GPU dedicada de entrada",price:950000,vram:8,length:230,tdp:160,tier:1},
  {id:"gpu-mid",name:"GPU dedicada gama media",price:1700000,vram:12,length:285,tdp:220,tier:2},
  {id:"gpu-high",name:"GPU dedicada gama alta",price:3200000,vram:16,length:330,tdp:300,tier:3}],
 board:[
  {id:"board-a520",name:"Motherboard A520",price:260000,socket:"AM4",ramType:"DDR4",gpuMax:260,tier:1},
  {id:"board-b550",name:"Motherboard B550",price:360000,socket:"AM4",ramType:"DDR4",gpuMax:320,tier:2},
  {id:"board-b650",name:"Motherboard B650",price:650000,socket:"AM5",ramType:"DDR5",gpuMax:360,tier:3},
  {id:"board-b650p",name:"Motherboard B650 premium",price:780000,socket:"AM5",ramType:"DDR5",gpuMax:380,tier:4}],
 ram:[
  {id:"ram-d4-16",name:"16 GB DDR4",price:180000,type:"DDR4",capacity:16,tier:1},
  {id:"ram-d4-32",name:"32 GB DDR4",price:300000,type:"DDR4",capacity:32,tier:2},
  {id:"ram-d5-16",name:"16 GB DDR5",price:250000,type:"DDR5",capacity:16,tier:1},
  {id:"ram-d5-32",name:"32 GB DDR5",price:400000,type:"DDR5",capacity:32,tier:3},
  {id:"ram-d5-64",name:"64 GB DDR5",price:760000,type:"DDR5",capacity:64,tier:4}],
 storage:[
  {id:"ssd-500",name:"SSD NVMe 500 GB",price:150000,capacity:500,tier:1},
  {id:"ssd-1tb",name:"SSD NVMe 1 TB",price:240000,capacity:1000,tier:2},
  {id:"ssd-2tb",name:"SSD NVMe 2 TB",price:480000,capacity:2000,tier:3}],
 psu:[
  {id:"psu-500",name:"Fuente 500 W",price:180000,watts:500,tier:1},
  {id:"psu-550",name:"Fuente 550 W 80+",price:230000,watts:550,tier:2},
  {id:"psu-650",name:"Fuente 650 W 80+",price:300000,watts:650,tier:3},
  {id:"psu-750",name:"Fuente 750 W Gold",price:420000,watts:750,tier:4},
  {id:"psu-850",name:"Fuente 850 W Gold",price:550000,watts:850,tier:5}],
 case:[
  {id:"case-compact",name:"Gabinete compacto",price:220000,gpuMax:260,tier:1},
  {id:"case-airflow",name:"Gabinete airflow RGB",price:320000,gpuMax:320,tier:2},
  {id:"case-premium",name:"Gabinete panorámico premium",price:550000,gpuMax:380,tier:3}],
 cooler:[
  {id:"cooler-air",name:"Disipador de aire",price:80000,tdpMax:75,tier:1},
  {id:"cooler-tower",name:"Disipador torre RGB",price:150000,tdpMax:120,tier:2},
  {id:"cooler-pro",name:"Disipador torre premium",price:220000,tdpMax:160,tier:3},
  {id:"cooler-aio",name:"Refrigeración líquida AIO",price:420000,tdpMax:220,tier:4}]
};
export const META={
 cpu:{label:"Procesador",icon:"▦"},gpu:{label:"Tarjeta gráfica",icon:"▧"},
 board:{label:"Placa madre",icon:"▥"},ram:{label:"Memoria RAM",icon:"▤"},
 storage:{label:"Almacenamiento",icon:"▰"},psu:{label:"Fuente de poder",icon:"ϟ"},
 case:{label:"Gabinete",icon:"▣"},cooler:{label:"Refrigeración",icon:"❄"}};
export const ORDER=["cpu","gpu","board","ram","storage","psu","case","cooler"];
export const DEFAULT_BUDGET=4500000;
