/* ────────────────────────────────────────────────────────────────────────────────
   HAWAII FLOODWATCH — MAP INITIALIZATION & LAYERS
   Sets up Leaflet map, tile layers, and all geographic data layers
   ──────────────────────────────────────────────────────────────────────────────── */

// ── TILE LAYERS ────────────────────────────────────────────────────────────────
var STREET = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  {attribution:'&copy; OpenStreetMap &copy; CARTO',subdomains:'abcd',maxZoom:20});
var SAT = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {attribution:'&copy; Esri',maxZoom:19});

// ── MAP INITIALIZATION ─────────────────────────────────────────────────────────
var map = L.map('map',{center:[21.45,-157.98],zoom:11,zoomControl:false,layers:[SAT]});
// Keep the initial view focused on Oʻahu at startup (Honolulu region), with ability to zoom out
var oahuBounds = L.latLngBounds([[21.20,-158.35],[21.75,-157.60]]);
map.fitBounds(oahuBounds, {maxZoom: 11, padding: [20, 20]});
map.setMinZoom(6); // allow users to zoom out to the full archipelago

var baseNow='sat';
function setBase(b){
  if(b===baseNow)return;
  if(b==='street'){map.removeLayer(SAT);STREET.addTo(map);}
  else{map.removeLayer(STREET);SAT.addTo(map);}
  baseNow=b;
  document.getElementById('btn-st').classList.toggle('active',b==='street');
  document.getElementById('btn-sa').classList.toggle('active',b==='sat');
}

// ── LAYER GROUPS ──────────────────────────────────────────────────────────────
var LG={
  impact:   L.layerGroup().addTo(map),
  evac:     L.layerGroup().addTo(map),
  dam:      L.layerGroup().addTo(map),
  rescue:   L.layerGroup().addTo(map),
  rain:     L.layerGroup().addTo(map),
  fema:     L.layerGroup().addTo(map),
  slr:      L.layerGroup(),
  waterways:L.layerGroup().addTo(map),
  watersheds: L.layerGroup(),
  elevation: L.layerGroup(),
  contamination: L.layerGroup(),
  soils:    L.layerGroup(),
  atmospheric_rivers: L.layerGroup(),
  census:   L.layerGroup(),
  impervious: L.layerGroup(),
};
var LON={impact:true,evac:true,dam:true,rescue:true,rain:true,fema:true,slr:false,waterways:true,watersheds:false,elevation:false,contamination:false,soils:false,atmospheric_rivers:false,census:false,impervious:false};
function TL(n){
  LON[n]=!LON[n];
  var el=document.getElementById('chk-'+n);
  if(el){el.classList.toggle('on',LON[n]);el.innerHTML=LON[n]?'✓':'';}
  if(LON[n])map.addLayer(LG[n]);else map.removeLayer(LG[n]);
}

// ── IMPACT ZONES ───────────────────────────────────────────────────────────────
IMPACT_ZONES.forEach(function(z){
  var html='<div class="pop"><div class="pop-title">'+z.name+'</div>';
  html+='<span class="pop-badge" style="background:'+borderMap[z.severity]+'">'+z.severity.toUpperCase()+'</span>';
  html+='<div class="pop-stat"><span>Peak rainfall</span><b>'+z.rain+'</b></div>';
  if(z.rescued) html+='<div class="pop-stat"><span>People rescued</span><b>'+z.rescued+'</b></div>';
  html+='<div class="pop-box '+(z.severity==='moderate'?'warn':'danger')+'">'+z.desc+'</div></div>';
  L.polygon(z.coords,{fillColor:colMap[z.severity],color:borderMap[z.severity],weight:2,opacity:.85,fillOpacity:.55})
   .bindPopup(html,{maxWidth:290}).addTo(LG.impact);
});

// ── EVACUATION ZONES ──────────────────────────────────────────────────────────
EVAC_ZONES.forEach(function(z){
  var html='<div class="pop"><div class="pop-title">'+z.name+'</div><span class="pop-badge" style="background:#7B2D8B">EVACUATION</span><div class="pop-box warn">'+z.desc+'</div></div>';
  L.polygon(z.coords,{fillColor:'rgba(123,45,139,.35)',color:'#7B2D8B',weight:2,dashArray:'8,4',opacity:.85,fillOpacity:.35})
   .bindPopup(html,{maxWidth:290}).addTo(LG.evac);
});

// ── DAM ────────────────────────────────────────────────────────────────────────
var damIcon=L.divIcon({html:'<div style="width:22px;height:22px;background:#D81B60;border:3px solid #fff;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,.4);color:#fff">D</div>',className:'',iconSize:[22,22],iconAnchor:[11,11]});
L.marker([21.503,-158.024],{icon:damIcon})
 .bindPopup('<div class="pop"><div class="pop-title">Wahiawa Dam</div><span class="pop-badge" style="background:#D81B60">DAM RISK</span><div class="pop-stat"><span>Built</span><b>1906 (earthen)</b></div><div class="pop-stat"><span>Evacuated</span><b>5,500 residents</b></div><div class="pop-box danger">Built to increase sugar production for the Waialua Agricultural Company (later Dole). Officials warned the dam could overtop during the March 20 storm. Concerns subsided as water levels stabilized, but the event exposed the risk of aging infrastructure in flood-prone watersheds.</div></div>',{maxWidth:290})
 .addTo(LG.dam);

// ── RESCUE SITES ──────────────────────────────────────────────────────────────
var rescueIcon=L.divIcon({html:'<div style="width:18px;height:18px;background:#E65100;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:bold;color:#fff;box-shadow:0 2px 5px rgba(0,0,0,.3)">R</div>',className:'',iconSize:[18,18],iconAnchor:[9,9]});
RESCUES.forEach(function(r){
  L.marker([r.lat,r.lng],{icon:rescueIcon})
   .bindPopup('<div class="pop"><div class="pop-title">'+r.name+'</div><div class="pop-stat"><span>People rescued</span><b>'+r.n+'</b></div><div class="pop-box danger">'+r.desc+'</div></div>',{maxWidth:280})
   .addTo(LG.rescue);
});

// ── EXTREME RAINFALL AREAS ─────────────────────────────────────────────────────
RAIN_AREAS.forEach(function(r){
  L.polygon(r.coords,{fillColor:'rgba(30,136,229,.2)',color:'#1E88E5',weight:1.5,dashArray:'6,4',fillOpacity:.2})
   .bindPopup('<div class="pop"><div class="pop-title">'+r.name+'</div><div class="pop-stat"><span>Rainfall (event total)</span><b>'+r.rain+'</b></div><div class="pop-box info">Extreme rainfall area from NWS HFO March 2026 rainfall summaries. Areas shown received more than 10 inches during the combined Kona low event period (March 10–24).</div></div>',{maxWidth:280})
   .addTo(LG.rain);
});

// ── FEMA SPECIAL FLOOD HAZARD ──────────────────────────────────────────────────
FEMA_AREAS.forEach(function(a){
  L.polygon(a.coords,{fillColor:'rgba(0,95,115,.35)',color:'#005F73',weight:1.5,dashArray:'4,3',fillOpacity:.35})
   .bindPopup('<div class="pop"><div class="pop-title">'+a.name+'</div><span class="pop-badge" style="background:#005F73">FEMA SFHA</span><div class="pop-box info">Special Flood Hazard Area from FEMA Digital Flood Insurance Rate Maps (DFIRM), December 2025. Mandatory flood insurance purchase applies. Full dataset at: geodata.hawaii.gov/arcgis/rest/services/Hazards/MapServer/5</div><a href="https://fhat.hawaii.gov/" target="_blank" style="font-size:10px;display:block;margin-top:6px">Open Hawaii Flood Hazard Assessment Tool</a></div>',{maxWidth:290})
   .addTo(LG.fema);
});

// ── SLR COASTAL FLOOD (3.2 ft scenario) ───────────────────────────────────────
SLR_AREAS.forEach(function(a){
  L.polygon(a.coords,{fillColor:'rgba(30,136,229,.3)',color:'#1E88E5',weight:1,fillOpacity:.3})
   .bindPopup('<div class="pop"><div class="pop-title">'+a.name+'</div><span class="pop-badge" style="background:#1E88E5">SLR 3.2 FT SCENARIO</span><div class="pop-box info">1% annual-chance coastal flood zone with 3.2 feet of sea level rise, modeled by UH Coastal Geology Group using HAZUS. Source: geodata.hawaii.gov/arcgis/rest/services/Hazards/MapServer/15. This scenario would greatly expand flood impacts compared to today\'s FIRM maps.</div></div>',{maxWidth:290})
   .addTo(LG.slr);
});

// ── PINEAPPLE SOILS DATA (Iron oxide content & flood risk) ─────────────────────
// Source: Hawaii Digital Soil Survey USDA/NRCS - https://geoportal.hawaii.gov/datasets/d246843c079d45dbb827e63062e4a509_42
Object.keys(SOIL_DATA).forEach(function(island_key){
  SOIL_DATA[island_key].forEach(function(s){
    var border_color = s.iron_oxide_pct.includes('24-30') ? '#8B4513' :
                       s.iron_oxide_pct.includes('22-28') ? '#A0522D' : '#D2691E';
    var iron_level = s.iron_oxide_pct.includes('24-30') ? 'CRITICAL' :
                     s.iron_oxide_pct.includes('22-28') ? 'HIGH' : 'MODERATE';

    var html = '<div class="pop">';
    html += '<div class="pop-title">'+s.name+'</div>';
    html += '<div class="pop-badge" style="background:'+border_color+'">'+iron_level+' IRON</div>';
    html += '<div class="pop-stat"><span>Soil series</span><b>'+s.soil_type+'</b></div>';
    html += '<div class="pop-stat"><span>Iron oxide content</span><b>'+s.iron_oxide_pct+'</b></div>';
    html += '<div class="pop-stat"><span>Elevation zone</span><b>~'+s.elevation_ft+' feet</b></div>';
    html += '<div class="pop-stat"><span>Parent material</span><b>'+s.parent_material+'</b></div>';
    html += '<div class="pop-b