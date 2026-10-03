const c=ROCK_CONFIG,d=supabase.createClient(c.SUPABASE_URL,c.SUPABASE_ANON_KEY),m=L.map("map").setView([c.RESTAURANT.lat,c.RESTAURANT.lng],15);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap"}).addTo(m);
L.marker([c.RESTAURANT.lat,c.RESTAURANT.lng]).addTo(m).bindPopup("<b>Rock Burger</b>");
const $=x=>document.getElementById(x), markers=new Map(), rows=new Map(); let first=true;
function km(a,b,x,y){let R=6371,r=z=>z*Math.PI/180,A=r(x-a),B=r(y-b),q=Math.sin(A/2)**2+Math.cos(r(a))*Math.cos(r(x))*Math.sin(B/2)**2;return 2*R*Math.asin(Math.sqrt(q))}
function esc(v){return String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}
function renderAll(){
  const list=[...rows.values()].sort((a,b)=>String(a.driver_name).localeCompare(String(b.driver_name)));
  $("drivers").innerHTML=list.length?list.map(r=>{
    const age=Math.max(0,Math.floor((Date.now()-new Date(r.updated_at))/1000));
    const state=age<45&&r.active?"🟢 En línea":r.active?"🟠 Sin actualización":"🔴 Turno finalizado";
    let dist="—"; if(r.latitude!=null){const x=km(r.latitude,r.longitude,c.RESTAURANT.lat,c.RESTAURANT.lng);dist=x<1?Math.round(x*1000)+" m":x.toFixed(2)+" km"}
    return `<article class="driver-card"><div><small>Repartidor</small><strong>${esc(r.driver_name||"Sin nombre")}</strong></div><div><small>Estado</small><strong>${state}</strong></div><div><small>Última ubicación</small><strong>${new Date(r.updated_at).toLocaleTimeString()}</strong></div><div><small>Distancia</small><strong>${dist}</strong></div></article>`
  }).join(""):"<p class='notice'>Aún no hay repartidores registrados.</p>";
  $("info").textContent=`${list.filter(r=>r.active).length} repartidor(es) con turno activo · ${list.length} registrado(s)`;
}
function render(r){
  if(!r||!r.driver_id)return; rows.set(r.driver_id,r);
  if(r.latitude!=null&&r.longitude!=null){
    const p=[r.latitude,r.longitude], label=esc(r.driver_name||"Repartidor"); let mk=markers.get(r.driver_id);
    if(mk){mk.setLatLng(p);mk.setPopupContent(`<b>${label}</b>`)}else{mk=L.marker(p).addTo(m).bindPopup(`<b>${label}</b>`);markers.set(r.driver_id,mk)}
    if(first){m.fitBounds(L.latLngBounds([p,[c.RESTAURANT.lat,c.RESTAURANT.lng]]).pad(.35));first=false}
  }
  renderAll();
}
async function load(){
  if(c.SUPABASE_URL.includes("PEGA_AQUI"))return $("info").textContent="Configura Supabase en config.js";
  let {data,error}=await d.from("driver_locations").select("*"); if(error)return $("info").textContent=error.message; (data||[]).forEach(render); renderAll();
}
load();
d.channel("rock-v2").on("postgres_changes",{event:"*",schema:"public",table:"driver_locations"},p=>render(p.new)).subscribe();
setInterval(renderAll,10000);
