/* Jugadores.js (ES Module) */

// =======================
// Firebase SDK (modular)
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc, setDoc, addDoc,
  serverTimestamp, increment
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// TU CONFIG (la que compartiste)
const firebaseConfig = {
  apiKey: "AIzaSyDZJION4BjCu51pkylJC_t2tsZxB3AGnN8",
  authDomain: "solar-fc-98639.firebaseapp.com",
  databaseURL: "https://solar-fc-98639-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "solar-fc-98639",
  storageBucket: "solar-fc-98639.firebasestorage.app",
  messagingSenderId: "221369666911",
  appId: "1:221369666911:web:7e881b9acd726935d4baea",
  measurementId: "G-1JGBWBEEZR"
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================
// Datos de jugadores
// =======================
const jugadores = [
  { nombre: "Ale", ataque: 2.64, defensa: 2.59, tactica: 1.97, estamina: 2.67, puntualidad: 3 },
  { nombre: "Fer", ataque: 3.39, defensa: 2.97, tactica: 3.17, estamina: 2.60, puntualidad: 3 },
  { nombre: "Jacob", ataque: 4.08, defensa: 3.63, tactica: 3.33, estamina: 3.57, puntualidad: 3 },
  { nombre: "Min", ataque: 1.89, defensa: 1.87, tactica: 1.73, estamina: 1.00, puntualidad: 3 },
  { nombre: "Damian", ataque: 4.65, defensa: 4.14, tactica: 4.47, estamina: 4.27, puntualidad: 3 },
  { nombre: "Mirko", ataque: 3.74, defensa: 4.10, tactica: 3.57, estamina: 3.67, puntualidad: 3 },
  { nombre: "Queco (GK)", ataque: 1.53, defensa: 4.46, tactica: 3.50, estamina: 3.67, puntualidad: 3 },
  { nombre: "Oriol (GK)", ataque: 1.34, defensa: 4.43, tactica: 3.43, estamina: 4.00, puntualidad: 3 },
  { nombre: "Abel", ataque: 3.18, defensa: 2.95, tactica: 3.33, estamina: 2.33, puntualidad: 3 },
  { nombre: "Arnau", ataque: 4.40, defensa: 3.82, tactica: 4.23, estamina: 4.10, puntualidad: 3 },
  { nombre: "Nicolo", ataque: 3.39, defensa: 3.57, tactica: 2.83, estamina: 3.00, puntualidad: 3 },
  { nombre: "Liya", ataque: 3.56, defensa: 3.23, tactica: 3.10, estamina: 3.43, puntualidad: 3 },
  { nombre: "Jon", ataque: 2.54, defensa: 2.47, tactica: 2.00, estamina: 2.90, puntualidad: 3 },
  { nombre: "Peña", ataque: 2.81, defensa: 2.74, tactica: 2.23, estamina: 4.47, puntualidad: 3 },
  { nombre: "Vito", ataque: 3.64, defensa: 4.40, tactica: 3.77, estamina: 3.83, puntualidad: 3 },
  { nombre: "Alex Jimenez", ataque: 4.62, defensa: 4.50, tactica: 4.40, estamina: 4.33, puntualidad: 3 },
  { nombre: "Andrea Maioli", ataque: 4.54, defensa: 4.43, tactica: 4.53, estamina: 4.60, puntualidad: 3 },
  { nombre: "Outman", ataque: 4.44, defensa: 4.90, tactica: 4.17, estamina: 4.83, puntualidad: 3 },
  { nombre: "Sergio Ramos", ataque: 4.20, defensa: 3.65, tactica: 4.17, estamina: 4.07, puntualidad: 3 },
  { nombre: "Tolga", ataque: 3.53, defensa: 3.18, tactica: 3.70, estamina: 3.67, puntualidad: 3 },
  { nombre: "Amadou", ataque: 3.60, defensa: 3.47, tactica: 3.60, estamina: 3.90, puntualidad: 3 },
  { nombre: "David rovira", ataque: 2.98, defensa: 2.96, tactica: 2.50, estamina: 3.07, puntualidad: 3 },
  { nombre: "Jeff", ataque: 3.83, defensa: 3.23, tactica: 3.20, estamina: 3.43, puntualidad: 3 },
  { nombre: "Tobi (GK)", ataque: 2.26, defensa: 4.32, tactica: 3.93, estamina: 3.93, puntualidad: 3 },
  { nombre: "Rolando", ataque: 2.20, defensa: 3.00, tactica: 2.40, estamina: 2.65, puntualidad: 3 },
  { nombre: "Tomas", ataque: 2.85, defensa: 3.10, tactica: 3.00, estamina: 3.00, puntualidad: 3 },
  { nombre: "Marcelo (GK)", ataque: 0.75, defensa: 4.10, tactica: 3.65, estamina: 3.50, puntualidad: 3 },
  { nombre: "Jorge", ataque: 2.75, defensa: 3.10, tactica: 2.75, estamina: 3.00, puntualidad: 3 },
  { nombre: "Enric Ll.", ataque: 1.50, defensa: 1.50, tactica: 1.35, estamina: 1.75, puntualidad: 3 },
  { nombre: "Codony", ataque: 4.30, defensa: 4.00, tactica: 4.20, estamina: 4.00, puntualidad: 3 },
  { nombre: "Magnus", ataque: 3.20, defensa: 3.00, tactica: 3.00, estamina: 3.00, puntualidad: 3 },
  { nombre: "Jeremy", ataque: 3.00, defensa: 2.67, tactica: 2.75, estamina: 2.50, puntualidad: 3 },
  { nombre: "Oriol", ataque: 3.80, defensa: 4.20, tactica: 3.80, estamina: 3.80, puntualidad: 3 },
  { nombre: "Manu", ataque: 4.48, defensa: 4.22, tactica: 4.30, estamina: 4.30, puntualidad: 3 },
  { nombre: "Harris", ataque: 2.38, defensa: 2.08, tactica: 2.25, estamina: 2.00, puntualidad: 3 },
  { nombre: "Ricard", ataque: 2.26, defensa: 2.38, tactica: 1.75, estamina: 2.00, puntualidad: 3 },
  { nombre: "Gustavo Madrigal", ataque: 2.91, defensa: 2.88, tactica: 2.00, estamina: 3.07, puntualidad: 3 },
  { nombre: "Diego", ataque: 1.98, defensa: 2.35, tactica: 1.83, estamina: 1.67, puntualidad: 3 },
  { nombre: "Vitor", ataque: 2.77, defensa: 2.72, tactica: 2.35, estamina: 2.25, puntualidad: 3 },
  { nombre: "Mario Lecce", ataque: 3.28, defensa: 3.35, tactica: 3.00, estamina: 3.00, puntualidad: 3 },
  { nombre: "Buda", ataque: 3.59, defensa: 3.82, tactica: 3.37, estamina: 3.80, puntualidad: 3 },
  { nombre: "Treppo", ataque: 3.90, defensa: 3.88, tactica: 3.55, estamina: 3.55, puntualidad: 3 },
  { nombre: "Dominic", ataque: 3.30, defensa: 3.00, tactica: 2.75, estamina: 2.75, puntualidad: 3 },
  { nombre: "Elias", ataque: 1.17, defensa: 1.25, tactica: 1.25, estamina: 2.25, puntualidad: 3 },

  // Visitors
  { nombre: "Visitor 1 (2)", ataque: 2.00, defensa: 2.00, tactica: 2.00, estamina: 2.00, puntualidad: 3 },
  { nombre: "Visitor 2 (2.5)", ataque: 2.50, defensa: 2.50, tactica: 2.50, estamina: 2.50, puntualidad: 3 },
  { nombre: "Visitor 3 (3)", ataque: 3.50, defensa: 3.50, tactica: 3.50, estamina: 3.50, puntualidad: 3 },

  // Hall of Fame
  { nombre: "Payno", ataque: 3.04, defensa: 2.74, tactica: 2.10, estamina: 2.25, puntualidad: 3 },
  { nombre: "Fabien", ataque: 2.98, defensa: 2.85, tactica: 2.00, estamina: 2.90, puntualidad: 3 },
  { nombre: "Mario", ataque: 1.78, defensa: 2.36, tactica: 1.87, estamina: 1.67, puntualidad: 3 },
  { nombre: "Merino", ataque: 2.90, defensa: 3.63, tactica: 2.60, estamina: 3.33, puntualidad: 3 },
  { nombre: "Yuancai", ataque: 1.59, defensa: 1.33, tactica: 1.23, estamina: 1.73, puntualidad: 3 },
  { nombre: "Steven", ataque: 3.04, defensa: 3.08, tactica: 2.50, estamina: 2.50, puntualidad: 3 },
  { nombre: "Andrea Aroldi", ataque: 2.17, defensa: 2.01, tactica: 1.40, estamina: 2.30, puntualidad: 3 },
  { nombre: "Kevin", ataque: 4.61, defensa: 4.23, tactica: 4.47, estamina: 4.53, puntualidad: 3 },
  { nombre: "Romain", ataque: 4.45, defensa: 4.40, tactica: 4.63, estamina: 3.60, puntualidad: 3 },
  { nombre: "Maykel", ataque: 3.01, defensa: 2.84, tactica: 2.25, estamina: 3.00, puntualidad: 3 },
  { nombre: "Alex Lopez", ataque: 3.58, defensa: 3.17, tactica: 2.75, estamina: 2.00, puntualidad: 3 },
  { nombre: "Massi", ataque: 4.70, defensa: 3.85, tactica: 4.60, estamina: 4.00, puntualidad: 3 },
  { nombre: "Trompia", ataque: 4.63, defensa: 4.60, tactica: 4.83, estamina: 4.43, puntualidad: 3 },
  { nombre: "Lori", ataque: 3.55, defensa: 2.95, tactica: 3.37, estamina: 3.30, puntualidad: 3 }
];

// =======================
// Firestore helpers
// =======================
const asistenciaMap = new Map();

async function cargarAsistencias() {
  asistenciaMap.clear();
  const snap = await getDocs(collection(db, "attendance"));
  snap.forEach(docSnap => {
    const d = docSnap.data();
    asistenciaMap.set(docSnap.id, d.count || 0);
  });
}

async function incrementarAsistencia(nombres) {
  // Para simplicidad: 1 setDoc por jugador
  await Promise.all(nombres.map(nombre => {
    const ref = doc(db, "attendance", nombre);
    return setDoc(ref, { count: increment(1) }, { merge: true });
  }));
}

async function guardarPartido(partido) {
  await addDoc(collection(db, "matches"), {
    ...partido,
    createdAt: serverTimestamp()
  });
}

// =======================
// Utilidades de rating
// =======================
function calcularMedia(j){ return (j.ataque*0.3 + j.defensa*0.3 + j.tactica*0.2 + j.estamina*0.2); }
function limitar(v){ return Math.max(0, Math.min(5, v)); }
function calcularFifa(j){ return Math.round(limitar(calcularMedia(j)) * 20); }

function colorClase(valor){
  valor = parseFloat(valor);
  if (valor < 1.5) return "valor-rojo";
  if (valor < 2.5) return "valor-naranja";
  if (valor < 3.5) return "valor-amarillo";
  if (valor < 4.5) return "valor-verde-claro";
  return "valor-verde-oscuro";
}
function colorFifa(valor){
  valor = parseFloat(valor);
  if (valor < 20) return "valor-rojo";
  if (valor < 40) return "valor-naranja";
  if (valor < 60) return "valor-amarillo";
  if (valor < 80) return "valor-verde-claro";
  return "valor-verde-oscuro";
}
function generarEstrellasFIFA(p){
  const total=5, val=Math.max(0,Math.min(p,100))/100*total;
  const llenas=Math.floor(val), dec=val-llenas;
  let media=0; if(dec>=0.75)media=1; else if(dec>=0.25)media=0.5;
  let s=""; for(let i=0;i<llenas;i++) s+='<i class="fas fa-star"></i>';
  if(media===1) s+='<i class="fas fa-star"></i>'; else if(media===0.5) s+='<i class="fas fa-star-half-alt"></i>';
  const vac=total-llenas-(media>0?1:0); for(let i=0;i<vac;i++) s+='<i class="far fa-star"></i>';
  return `<span class="fifa-stars">${s}</span>`;
}

// =======================
// Tabla de jugadores
// =======================
let jugadoresOriginal=[...jugadores];
let jugadoresOrdenados=[...jugadores];
let ordenActual={columna:null,estado:0};

function ordenarPor(col){
  if(ordenActual.columna!==col) ordenActual={columna:col,estado:1};
  else ordenActual.estado=(ordenActual.estado+1)%3;
  if(ordenActual.estado===0) jugadoresOrdenados=[...jugadoresOriginal];
  else{
    const dir = ordenActual.estado===1 ? -1 : 1;
    jugadoresOrdenados.sort((a,b)=>{
      const val=(j,c)=> c==="media"?calcularMedia(j): (c==="nombre"? j[c].toLowerCase(): parseFloat(j[c]));
      const va=val(a,col), vb=val(b,col);
      return va<vb? -1*dir : va>vb? 1*dir : 0;
    });
  }
  mostrarTabla();
}

function mostrarTabla(){
  const tbody=document.querySelector("#tabla-jugadores tbody");
  if(!tbody) return;
  tbody.innerHTML="";
  jugadoresOrdenados.forEach(j=>{
    const mediaVal=limitar(calcularMedia(j));
    const media=mediaVal.toFixed(2);
    const fifa=Math.round(mediaVal*20);
    const estrellasHTML=generarEstrellasFIFA(fifa);
    const asist = asistenciaMap.has(j.nombre) ? asistenciaMap.get(j.nombre) : 0;

    const fila=`<tr>
      <td>${j.nombre}</td>
      <td><span class="${colorClase(j.ataque)}">${j.ataque}</span></td>
      <td><span class="${colorClase(j.defensa)}">${j.defensa}</span></td>
      <td><span class="${colorClase(j.tactica)}">${j.tactica}</span></td>
      <td><span class="${colorClase(j.estamina)}">${j.estamina}</span></td>
      <td><span class="${colorClase(j.puntualidad)}">${j.puntualidad ?? '-'}</span></td>
      <td><span class="${colorClase(media)}">${media}</span></td>
      <td><span class="${colorFifa(fifa)}">${fifa}</span></td>
      <td class="stars">${estrellasHTML}</td>
      <td><strong>${asist}</strong></td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", fila);
  });
}

// =======================
// Historial (local JSON)
// =======================
function fmt2(x){ if(x===undefined||x===null||Number.isNaN(x)) return "—"; return (typeof x==="number"?x:parseFloat(x)).toFixed(2); }
function mostrarHistorial(){
  fetch("historial.json").then(r=>r.json()).then(data=>{
    const cont=document.getElementById("lista-historial");
    cont.innerHTML="";
    data.forEach(p=>{
      const tarjeta=document.createElement("div"); tarjeta.className="col";
      const eqHTML=(eq,color)=>`
        <h5><span class="circle ${color}-circle"></span> ${eq.nombre}</h5>
        <p>ATK:${fmt2(eq.atk)} | DEF:${fmt2(eq.def)} | TACT:${fmt2(eq.tact)} | STA:${fmt2(eq.sta)} | FIFA:${eq.fifa ?? '—'} | Goles:${eq.goles ?? '—'}</p>
        <ul class="list-group mb-2">${eq.jugadores.map(n=>`<li class="list-group-item">${n}</li>`).join("")}</ul>`;
      tarjeta.innerHTML=`
        <div class="card shadow-sm">
          <div class="card-header text-center">
            <div class="fw-bold mb-1">${new Date(p.fecha).toLocaleDateString("es-ES")}</div>
            <div class="fs-4 fw-bold text-dark">${p.marcador ?? ''}</div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">${eqHTML(p.equipo1,"azul")}</div>
              <div class="col-md-6">${eqHTML(p.equipo2,"rojo")}</div>
            </div>
          </div>
        </div>`;
      cont.appendChild(tarjeta);
    });
  }).catch(err=>{
    document.getElementById("lista-historial").innerHTML = `<div class="alert alert-danger">Error al cargar historial: ${err.message}</div>`;
  });
}

// =======================
// Algoritmo de equipos (partido)
// =======================
const STAR_CUTOFF=3.75, LOW_CUTOFF=2.00;
const ALPHA=3.0, GAMMA=0.75, DELTA=0.5;
function esGK(j){ return /\(GK\)/i.test(j.nombre) || j.nombre.toLowerCase().includes("gk"); }
function esStar(j){ return calcularMedia(j)>=STAR_CUTOFF; }
function esLow(j){ return calcularMedia(j)<=LOW_CUTOFF; }
function esCapitan(j){ return calcularMedia(j)>4.0; }

function teamScore(team){
  const ratings=team.map(p=>calcularMedia(p));
  const base=ratings.reduce((a,b)=>a+b,0);
  const stars=team.filter(esStar), lows=team.filter(esLow);
  const nStar=stars.length, nLow=lows.length;
  const lowDepth=lows.length? lows.reduce((a,p)=>a+Math.max(0,LOW_CUTOFF-calcularMedia(p)),0)/lows.length : 0;
  const pLow= team.length>1 ? (nLow/(team.length-1)) : 0;
  const carryBonus=stars.reduce((s,st)=> s + ALPHA*Math.max(0,calcularMedia(st)-STAR_CUTOFF)*pLow*lowDepth, 0);
  const orphanPenalty=GAMMA*Math.max(0,nLow-2*nStar);
  const starPenalty=DELTA*Math.max(0,nStar-2);
  return base + carryBonus - orphanPenalty - starPenalty;
}
function conteoRol(team){ return { gk:team.filter(esGK).length, star:team.filter(esStar).length, low:team.filter(esLow).length, cap:team.filter(esCapitan).length }; }
function costeEquipos(A,B){
  const sA=teamScore(A), sB=teamScore(B), m=(sA+sB)/2, varScore=((sA-m)**2+(sB-m)**2)/2;
  const a=conteoRol(A), b=conteoRol(B);
  const P_STAR_DIFF=3.0, P_LOW_DIFF=2.5, P_CAP_OVER=1.5, P_LOW_MISS=4.0, P_GK_SPLIT=6.0;
  const totalGK=a.gk+b.gk, needSplit=(totalGK===2), badGK=needSplit? Math.abs(a.gk-b.gk):0;
  const totalLow=a.low+b.low, lowMiss = (totalLow>0? ((a.low===0)?1:0)+((b.low===0)?1:0) : 0);
  return varScore
    + P_STAR_DIFF*Math.abs(a.star-b.star)
    + P_LOW_DIFF*Math.abs(a.low-b.low)
    + P_CAP_OVER*(Math.max(0,a.cap-2)+Math.max(0,b.cap-2))
    + P_LOW_MISS*lowMiss
    + (needSplit? P_GK_SPLIT*badGK : 0);
}
function seedSnake(players){
  const arr=players.slice().sort((a,b)=>calcularMedia(b)-calcularMedia(a));
  let A=[],B=[];
  const gks=arr.filter(esGK);
  if(gks.length>=2){
    A.push(gks[0]); B.push(gks[1]);
    let removed=0;
    for(let i=arr.length-1;i>=0 && removed<2;i--){ if(esGK(arr[i])){arr.splice(i,1); removed++;} }
  }
  let lr=true;
  while(arr.length){
    const chunk=arr.splice(0,2);
    if(lr){ if(chunk[0])A.push(chunk[0]); if(chunk[1])B.push(chunk[1]); }
    else  { if(chunk[0])B.push(chunk[0]); if(chunk[1])A.push(chunk[1]); }
    lr=!lr;
  }
  return [A,B];
}

// =======================
// UI helpers (bloques)
// =======================
function splitEnBloques(lista){
  const res={habituales:[], visitors:[], hall:[]};
  let vistoVisitor=false;
  for(const j of lista){
    const esVisitor=/^Visitor\b/i.test(j.nombre);
    if(esVisitor){ vistoVisitor=true; res.visitors.push(j); }
    else if(!vistoVisitor){ res.habituales.push(j); }
    else { res.hall.push(j); }
  }
  return res;
}
function renderBloque(contenedor, titulo, clase, data, checkboxClass, idPrefix){
  let html = `<div class="player-block ${clase}"><h6>${titulo}</h6><div class="player-grid">`;
  for(const j of data){
    const idx = jugadores.indexOf(j);
    html += `<div class="form-check">
      <input class="form-check-input ${checkboxClass}" type="checkbox" id="${idPrefix}${idx}" value="${idx}">
      <label class="form-check-label" for="${idPrefix}${idx}">${j.nombre}</label>
    </div>`;
  }
  html += `</div></div>`;
  contenedor.insertAdjacentHTML("beforeend", html);
}

// =======================
// Generar 2 equipos (Partido)
// =======================
function generarEquipos(){
  try{
    const seleccionados = Array.from(document.querySelectorAll(".jugador-checkbox:checked"))
      .map(cb=>jugadores[parseInt(cb.value)])
      .map(j=>({...j, media:calcularMedia(j), fifa:calcularFifa(j)}));
    if(seleccionados.length<10 || seleccionados.length>12) throw new Error("Selecciona entre 10 y 12 jugadores para formar 2 equipos.");

    let [bestA,bestB]=seedSnake(seleccionados);
    let bestCost=costeEquipos(bestA,bestB);

    for(let t=0;t<4000;t++){
      const A=bestA.slice(), B=bestB.slice();
      const ia=Math.floor(Math.random()*A.length), ib=Math.floor(Math.random()*B.length);
      [A[ia],B[ib]]=[B[ib],A[ia]];
      const c=costeEquipos(A,B);
      if(c<bestCost){ bestA=A; bestB=B; bestCost=c; }
    }

    const sum=(arr,f)=>arr.reduce((s,x)=>s+f(x),0);
    const s1={ atk:(sum(bestA,x=>x.ataque)/bestA.length).toFixed(2),
               def:(sum(bestA,x=>x.defensa)/bestA.length).toFixed(2),
               tact:(sum(bestA,x=>x.tactica)/bestA.length).toFixed(2),
               sta:(sum(bestA,x=>x.estamina)/bestA.length).toFixed(2),
               fifaAvg:Math.round(sum(bestA,x=>x.fifa)/bestA.length) };
    const s2={ atk:(sum(bestB,x=>x.ataque)/bestB.length).toFixed(2),
               def:(sum(bestB,x=>x.defensa)/bestB.length).toFixed(2),
               tact:(sum(bestB,x=>x.tactica)/bestB.length).toFixed(2),
               sta:(sum(bestB,x=>x.estamina)/bestB.length).toFixed(2),
               fifaAvg:Math.round(sum(bestB,x=>x.fifa)/bestB.length) };

    const cont=document.getElementById("resultado-equipos");
    cont.innerHTML=`
      <div class="col-md-6">
        <h5><span class="circle white-circle"></span><span class="circle blue-circle"></span> Equipo 1</h5>
        <p>ATK: ${s1.atk} | DEF: ${s1.def} | TACT: ${s1.tact} | STA: ${s1.sta} | FIFA: ${s1.fifaAvg}</p>
        <ul class="list-group">
          ${bestA.map(j=>`<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${calcularMedia(j)>4?' <strong>(C)</strong>':''}</li>`).join("")}
        </ul>
      </div>
      <div class="col-md-6">
        <h5><span class="circle red-circle"></span><span class="circle orange-circle"></span> Equipo 2</h5>
        <p>ATK: ${s2.atk} | DEF: ${s2.def} | TACT: ${s2.tact} | STA: ${s2.sta} | FIFA: ${s2.fifaAvg}</p>
        <ul class="list-group">
          ${bestB.map(j=>`<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${calcularMedia(j)>4?' <strong>(C)</strong>':''}</li>`).join("")}
        </ul>
      </div>
      <div class="col-12 mt-3">
        <button id="btn-abrir-asistencia" class="btn btn-success">Guardar partido / Confirmar asistencia</button>
      </div>`;

    // Modal de asistencia/partido
    const openBtn=document.getElementById("btn-abrir-asistencia");
    if(openBtn){
      openBtn.addEventListener("click", ()=>{
        const hoy=new Date().toISOString().slice(0,10);
        const inFecha=document.getElementById("partido-fecha"); if(inFecha) inFecha.value=hoy;
        const box1=document.getElementById("asist-eq1");
        const box2=document.getElementById("asist-eq2");
        if(box1&&box2){
          box1.innerHTML = bestA.map(j=>`
            <div class="col"><div class="form-check">
              <input class="form-check-input asist-eq1" type="checkbox" id="as1_${j.nombre}" value="${j.nombre}" checked>
              <label class="form-check-label" for="as1_${j.nombre}">${j.nombre}</label>
            </div></div>`).join('');
          box2.innerHTML = bestB.map(j=>`
            <div class="col"><div class="form-check">
              <input class="form-check-input asist-eq2" type="checkbox" id="as2_${j.nombre}" value="${j.nombre}" checked>
              <label class="form-check-label" for="as2_${j.nombre}">${j.nombre}</label>
            </div></div>`).join('');
        }
        const modal = new bootstrap.Modal(document.getElementById("modalAsistencia"));
        modal.show();

        const btnGuardar=document.getElementById("btn-guardar-asistencia");
        const handler=async ()=>{
          try{
            const fecha=(document.getElementById("partido-fecha")?.value)||hoy;
            const marcador=(document.getElementById("partido-marcador")?.value||"").trim();
            const asistentes=[
              ...Array.from(document.querySelectorAll(".asist-eq1:checked")).map(el=>el.value),
              ...Array.from(document.querySelectorAll(".asist-eq2:checked")).map(el=>el.value)
            ];
            await incrementarAsistencia(asistentes);
            await guardarPartido({
              fecha,
              marcador: marcador || null,
              equipo1: bestA.map(j=>j.nombre),
              equipo2: bestB.map(j=>j.nombre),
              stats: { s1, s2 }
            });
            await cargarAsistencias();
            mostrarTabla();
            modal.hide();
          }catch(e){ alert("Error guardando asistencia/partido: " + e.message); }
          finally{ btnGuardar.removeEventListener("click",handler); }
        };
        btnGuardar.addEventListener("click", handler);
      });
    }

  }catch(e){
    const cont=document.getElementById("resultado-equipos");
    cont.innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`;
  }
}

// =======================
// Torneo 4 equipos (igual a tu versión previa con medias de equipo)
// =======================
function generarEquiposTorneo(){
  const seleccionados = Array.from(document.querySelectorAll(".jugador-torneo-checkbox:checked"))
    .map(cb=>jugadores[parseInt(cb.value)])
    .map(j=>({...j, media:calcularMedia(j), fifa:calcularFifa(j)}));

  const cont=document.getElementById("resultado-torneo");
  if(seleccionados.length<20 || seleccionados.length>24){
    cont.innerHTML=`<div class="alert alert-danger">Selecciona entre 20 y 24 jugadores para el torneo.</div>`;
    return;
  }

  const intentos=2000;
  let mejorScore=Infinity, mejorCompSpread=Infinity, mejorTopDiff=Infinity, mejores=null;

  for(let i=0;i<intentos;i++){
    const mezcla=[...seleccionados].sort(()=>Math.random()-0.5);
    const eqs=[[],[],[],[]];
    mezcla.forEach((j,idx)=>eqs[idx%4].push(j));

    const stats=eqs.map(eq=>({
      atk:eq.reduce((s,j)=>s+j.ataque,0)/eq.length,
      def:eq.reduce((s,j)=>s+j.defensa,0)/eq.length,
      tact:eq.reduce((s,j)=>s+j.tactica,0)/eq.length,
      sta:eq.reduce((s,j)=>s+j.estamina,0)/eq.length,
      rating:eq.reduce((s,j)=>s+calcularMedia(j),0)/eq.length,
      fifa: Math.round(eq.reduce((s,j)=>s+j.fifa,0)/eq.length),
      top:eq.filter(j=>j.media>4).length
    }));

    const ratings=stats.map(s=>s.rating);
    const score=Math.max(...ratings)-Math.min(...ratings);

    const spA=Math.max(...stats.map(s=>s.atk))-Math.min(...stats.map(s=>s.atk));
    const spD=Math.max(...stats.map(s=>s.def))-Math.min(...stats.map(s=>s.def));
    const spT=Math.max(...stats.map(s=>s.tact))-Math.min(...stats.map(s=>s.tact));
    const spS=Math.max(...stats.map(s=>s.sta))-Math.min(...stats.map(s=>s.sta));
    const comp=0.3*spA+0.3*spD+0.2*spT+0.2*spS;

    const topCounts=stats.map(s=>s.top);
    const topDiff=Math.max(...topCounts)-Math.min(...topCounts);

    const mejor=(score<mejorScore) ||
                (score===mejorScore && comp<mejorCompSpread) ||
                (score===mejorScore && comp===mejorCompSpread && topDiff<mejorTopDiff);
    if(mejor){ mejorScore=score; mejorCompSpread=comp; mejorTopDiff=topDiff; mejores={eqs,stats}; }
  }

  cont.innerHTML="";
  const colores=["azul","blanco","rojo","verde"];
  mejores.eqs.forEach((eq,i)=>{
    const s=mejores.stats[i];
    cont.innerHTML += `
      <div class="col-md-6 col-lg-3">
        <h5><span class="circle ${colores[i]}-circle"></span> Equipo ${colores[i][0].toUpperCase()+colores[i].slice(1)}</h5>
        <p>ATK:${s.atk.toFixed(2)} | DEF:${s.def.toFixed(2)} | TACT:${s.tact.toFixed(2)} | STA:${s.sta.toFixed(2)} | FIFA:${s.fifa}</p>
        <ul class="list-group">
          ${eq.map(j=>`<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${calcularMedia(j)>4?' <strong>(C)</strong>':''}</li>`).join("")}
        </ul>
      </div>`;
  });
}

// =======================
// Manual
// =======================
function actualizarContadoresManual(){
  const c1=document.querySelectorAll(".jugador-manual-1:checked").length;
  const c2=document.querySelectorAll(".jugador-manual-2:checked").length;
  const btn=document.getElementById("generar-manual");
  const t1=document.getElementById("contador-manual-1");
  const t2=document.getElementById("contador-manual-2");
  if(t1) t1.textContent=`Seleccionados: ${c1}`;
  if(t2) t2.textContent=`Seleccionados: ${c2}`;
  if(btn) btn.disabled = !(c1===c2 && c1>=3);
}
function initManualTab(){
  const f1=document.getElementById("form-manual-1");
  const f2=document.getElementById("form-manual-2");
  if(!f1 || !f2) return;
  f1.innerHTML=""; f2.innerHTML="";
  jugadores.forEach((j,i)=>{
    const id1=`manual1_${i}`, id2=`manual2_${i}`;
    f1.insertAdjacentHTML("beforeend",`
      <div class="form-check col-md-6">
        <input class="form-check-input jugador-manual-1" type="checkbox" id="${id1}" data-peer="${id2}" value="${i}">
        <label class="form-check-label" for="${id1}">${j.nombre}</label>
      </div>`);
    f2.insertAdjacentHTML("beforeend",`
      <div class="form-check col-md-6">
        <input class="form-check-input jugador-manual-2" type="checkbox" id="${id2}" data-peer="${id1}" value="${i}">
        <label class="form-check-label" for="${id2}">${j.nombre}</label>
      </div>`);
  });
  const wire=(sel)=>document.querySelectorAll(sel).forEach(cb=>{
    cb.addEventListener("change",(e)=>{
      const peerId=e.target.getAttribute("data-peer");
      const peer=document.getElementById(peerId);
      if(!peer) return;
      if(e.target.checked){ peer.checked=false; peer.disabled=true; }
      else { peer.disabled=false; }
      actualizarContadoresManual();
    });
  });
  wire(".jugador-manual-1"); wire(".jugador-manual-2"); actualizarContadoresManual();
  const btn=document.getElementById("generar-manual");
  if(btn) btn.addEventListener("click",(e)=>{ e.preventDefault(); generarEquiposManual(); });
}
function generarEquiposManual(){
  const sel1=Array.from(document.querySelectorAll(".jugador-manual-1:checked")).map(cb=>parseInt(cb.value));
  const sel2=Array.from(document.querySelectorAll(".jugador-manual-2:checked")).map(cb=>parseInt(cb.value));
  if(sel1.length!==sel2.length || sel1.length<3){ alert("Selecciona el mismo número de jugadores en ambos equipos (mínimo 3)."); return; }
  const eq1=sel1.map(i=>({...jugadores[i], media:calcularMedia(jugadores[i]), fifa:calcularFifa(jugadores[i])}));
  const eq2=sel2.map(i=>({...jugadores[i], media:calcularMedia(jugadores[i]), fifa:calcularFifa(jugadores[i])}));
  const avg=(arr,f)=>(arr.reduce((s,x)=>s+f(x),0)/arr.length);
  const s1={atk:avg(eq1,j=>j.ataque).toFixed(2), def:avg(eq1,j=>j.defensa).toFixed(2), tact:avg(eq1,j=>j.tactica).toFixed(2), sta:avg(eq1,j=>j.estamina).toFixed(2), fifaAvg:Math.round(avg(eq1,j=>j.fifa)), score:teamScore(eq1).toFixed(2)};
  const s2={atk:avg(eq2,j=>j.ataque).toFixed(2), def:avg(eq2,j=>j.defensa).toFixed(2), tact:avg(eq2,j=>j.tactica).toFixed(2), sta:avg(eq2,j=>j.estamina).toFixed(2), fifaAvg:Math.round(avg(eq2,j=>j.fifa)), score:teamScore(eq2).toFixed(2)};
  const cont=document.getElementById("resultado-manual");
  cont.innerHTML=`
    <div class="col-md-6">
      <h5><span class="circle white-circle"></span><span class="circle blue-circle"></span> Equipo 1</h5>
      <p>ATK:${s1.atk} | DEF:${s1.def} | TACT:${s1.tact} | STA:${s1.sta} | FIFA:${s1.fifaAvg} | <strong>Score:</strong> ${s1.score}</p>
      <ul class="list-group">${eq1.map(j=>`<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${j.media>4?' <strong>(C)</strong>':''}</li>`).join("")}</ul>
    </div>
    <div class="col-md-6">
      <h5><span class="circle red-circle"></span><span class="circle orange-circle"></span> Equipo 2</h5>
      <p>ATK:${s2.atk} | DEF:${s2.def} | TACT:${s2.tact} | STA:${s2.sta} | FIFA:${s2.fifaAvg} | <strong>Score:</strong> ${s2.score}</p>
      <ul class="list-group">${eq2.map(j=>`<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${j.media>4?' <strong>(C)</strong>':''}</li>`).join("")}</ul>
    </div>`;
}

// =======================
// Arranque
// =======================
document.addEventListener("DOMContentLoaded", async ()=>{
  // Cargar asistencias y tabla
  try{ await cargarAsistencias(); }catch(e){ console.warn("No pude cargar asistencia:", e); }
  mostrarTabla();

  // Sorting headers
  const cols=["nombre","ataque","defensa","tactica","estamina","puntualidad","media","fifa"];
  document.querySelectorAll("#tabla-jugadores thead th").forEach((th,i)=>{
    const c = ["nombre","ataque","defensa","tactica","estamina","puntualidad","media","fifa",null,null][i];
    if(c){
      th.classList.add("sortable"); th.style.cursor="pointer";
      th.addEventListener("click",()=>{
        ordenarPor(c);
        document.querySelectorAll("#tabla-jugadores thead th").forEach(x=>x.classList.remove("orden-asc","orden-desc"));
        if(ordenActual.estado===1) th.classList.add("orden-desc");
        else if(ordenActual.estado===2) th.classList.add("orden-asc");
      });
    }
  });

  // Rellenar Partido/Torneo con bloques
  // Partido
  const formAsis=document.getElementById("form-asistencia");
  const contPart=document.getElementById("contador-partido");
  const btnPart=document.getElementById("generar-equipos");
  if(formAsis && contPart){
    formAsis.innerHTML="";
    const b=splitEnBloques(jugadores);
    renderBloque(formAsis,"Habituales","habituales",b.habituales,"jugador-checkbox","jugador");
    renderBloque(formAsis,"Visitors","visitors",b.visitors,"jugador-checkbox","jugador");
    renderBloque(formAsis,"Hall of Fame","hall",b.hall,"jugador-checkbox","jugador");
    document.querySelectorAll(".jugador-checkbox").forEach(cb=>{
      cb.addEventListener("change",()=>{
        const n=document.querySelectorAll(".jugador-checkbox:checked").length;
        contPart.textContent="Seleccionados: "+n;
        if(btnPart) btnPart.disabled = !(n>=10 && n<=12);
      });
    });
  }

  // Torneo
  const formT=document.getElementById("form-torneo");
  const contT=document.getElementById("contador-torneo");
  const btnT=document.getElementById("generar-torneo");
  if(formT && contT){
    formT.innerHTML="";
    const b=splitEnBloques(jugadores);
    renderBloque(formT,"Habituales","habituales",b.habituales,"jugador-torneo-checkbox","jugadorTorneo");
    renderBloque(formT,"Visitors","visitors",b.visitors,"jugador-torneo-checkbox","jugadorTorneo");
    renderBloque(formT,"Hall of Fame","hall",b.hall,"jugador-torneo-checkbox","jugadorTorneo");
    document.querySelectorAll(".jugador-torneo-checkbox").forEach(cb=>{
      cb.addEventListener("change",()=>{
        const n=document.querySelectorAll(".jugador-torneo-checkbox:checked").length;
        contT.textContent="Seleccionados: "+n;
        if(btnT) btnT.disabled = !(n>=20 && n<=24);
      });
    });
  }

  // Botones principales
  document.getElementById("generar-equipos")?.addEventListener("click", generarEquipos);
  document.getElementById("generar-torneo")?.addEventListener("click", generarEquiposTorneo);

  // Manual
  initManualTab();

  // Historial al abrir
  document.querySelector('a[href="#historial"]')?.addEventListener("click", ()=>{ mostrarHistorial(); });
});
