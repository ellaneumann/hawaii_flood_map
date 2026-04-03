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
    html += '<div class="pop-box danger"><strong>Flood Hazard:</strong> '+s.flood_impact+'</div>';
    html += '<div class="pop-box info"><strong>Hazards:</strong> '+s.hazards.join(' - ')+'</div>';
    html += '<a href="'+s.source_url+'" target="_blank" style="font-size:9px;color:#0066cc;display:block;margin-top:4px">USDA Soil Series Description</a>';
    html += '</div>';

    var fill_color = border_color.split('#')[1];
    var r = parseInt(fill_color.substr(0,2),16);
    var g = parseInt(fill_color.substr(2,2),16);
    var b = parseInt(fill_color.substr(4,2),16);

    L.polygon(s.coords,{fillColor:'rgba('+r+','+g+','+b+',0.25)',color:border_color,weight:2,dashArray:'2,3',fillOpacity:0.25})
      .bindPopup(html,{maxWidth:300}).addTo(LG.soils);
  });
});

// ── ATMOSPHERIC RIVER FORECAST DATA (CW3E / UCSD) ────────────────────────────────
// Source: Center for Western Weather and Water Extremes - https://cw3e.ucsd.edu/iwv-and-ivt-forecasts/
ATMOSPHERIC_RIVERS.forEach(function(ar){
  var ar_color = ar.ar_classification.includes('5')?'#FF0000':
                 ar.ar_classification.includes('4')?'#FF6600':'#FF9900';
  var html='<div class="pop"><div class="pop-title">'+ar.name+'</div>';
  html+='<span class="pop-badge" style="background:'+ar_color+'">'+ar.ar_classification+'</span>';
  html+='<div class="pop-stat"><span>Peak IVT</span><b>'+ar.ivt_peak+'</b></div>';
  html+='<div class="pop-stat"><span>Duration</span><b>'+ar.duration_hours+' hours</b></div>';
  html+='<div class="pop-stat"><span>Rainfall total</span><b>'+ar.rainfall_total+'</b></div>';
  html+='<div class="pop-stat"><span>Models</span><b>'+ar.model+'</b></div>';
  html+='<div class="pop-box info">'+ar.desc+'</div>';
  html+='<a href="'+ar.url+'" target="_blank" style="font-size:9px;color:#0066cc;display:block;margin-top:4px">CW3E AR Scale Analysis</a></div>';
  L.polyline(ar.pts,{color:ar_color,weight:4,opacity:.8,dashArray:'10,5'})
   .bindPopup(html,{maxWidth:300}).addTo(LG.atmospheric_rivers);
});

// ── CENSUS DATA LAYER (Population exposure to floods) ────────────────────────────
// Source: 2020 US Census via Hawaii Geoportal - https://geoportal.hawaii.gov/datasets/1815a6c2c1fc40c39e575f7330dd62c6_34
CENSUS_DATA.forEach(function(c){
  var html='<div class="pop"><div class="pop-title">'+c.name+'</div>';
  html+='<span class="pop-badge" style="background:#7B2D8B">CENSUS 2020</span>';
  html+='<div class="pop-stat"><span>Population</span><b>'+c.population.toLocaleString()+'</b></div>';
  html+='<div class="pop-stat"><span>Density (per sq mi)</span><b>'+c.population_density+'</b></div>';
  html+='<div class="pop-stat"><span>Households</span><b>'+c.households.toLocaleString()+'</b></div>';
  html+='<div class="pop-stat"><span>Median income</span><b>'+c.median_income+'</b></div>';
  html+='<div class="pop-stat"><span>People at risk (2026)</span><b>'+c.people_at_risk+' ('+Math.round(c.people_at_risk/c.population*100)+'%)</b></div>';
  html+='<div class="pop-box danger">Flood exposure: <strong>'+c.flood_exposure.toUpperCase()+'</strong></div>';
  html+='<div class="pop-box info">'+c.desc+'</div>';
  html+='<a href="'+c.source_url+'" target="_blank" style="font-size:9px;color:#0066cc;display:block;margin-top:4px">Hawaii Geoportal Census Data</a></div>';
  L.polygon(c.coords,{fillColor:'rgba(123,45,139,.3)',color:'#7B2D8B',weight:2,fillOpacity:.3})
   .bindPopup(html,{maxWidth:300}).addTo(LG.census);
});

// ── IMPERVIOUS SURFACE DATA (Urban runoff multiplier) ────────────────────────────
// Source: NLCD Fractional Impervious Surface - https://www.mrlc.gov/data/type/fractional-impervious-surface
IMPERVIOUS_SURFACE.forEach(function(imp){
  var imp_color = imp.impervious_pct.startsWith('75')?'#404040':
                  imp.impervious_pct.startsWith('40')?'#707070':'#B0B0B0';
  var html='<div class="pop"><div class="pop-title">'+imp.name+'</div>';
  html+='<span class="pop-badge" style="background:#404040">IMPERVIOUS SURFACE</span>';
  html+='<div class="pop-stat"><span>Impervious coverage</span><b>'+imp.impervious_pct+'</b></div>';
  html+='<div class="pop-stat"><span>Land use</span><b>'+imp.land_use+'</b></div>';
  html+='<div class="pop-stat"><span>Area</span><b>'+imp.area_sq_miles.toFixed(1)+' sq mi</b></div>';
  html+='<div class="pop-stat"><span>Runoff coefficient</span><b>'+imp.runoff_coeff+'</b></div>';
  html+='<div class="pop-stat"><span>Peak flow increase</span><b>'+imp.flood_risk_increase+'</b></div>';
  html+='<div class="pop-box warn">Stormwater capacity: '+imp.stormwater_capacity+'</div>';
  html+='<div class="pop-box info">'+imp.desc;
  if(imp.pineapple_soil_note) html+=' <br><strong>Soil note:</strong> '+imp.pineapple_soil_note;
  html+='</div>';
  html+='<a href="'+imp.source_url+'" target="_blank" style="font-size:9px;color:#0066cc;display:block;margin-top:4px">NLCD Impervious Surface Data</a></div>';
  var hex = imp_color.split('#')[1];
  L.polygon(imp.coords,{fillColor:'rgba('+parseInt(hex.substr(0,2),16)+','+parseInt(hex.substr(2,2),16)+','+parseInt(hex.substr(4,2),16)+',0.3)',color:imp_color,weight:2,fillOpacity:.35})
   .bindPopup(html,{maxWidth:320}).addTo(LG.impervious);
});

// ── MAJOR STREAMS (OLD - commented out, replaced by detailed waterway network) ──
// Kept here for reference - replaced by WATERWAY_NETWORK from data.js

// ── HIGH-QUALITY WATERWAY NETWORK WITH FLOW DIRECTIONS ──────────────────────────
WATERWAY_NETWORK.forEach(function(w){
  var style={
    color:w.color,
    weight:w.width,
    opacity:0.8,
    lineCap:'round',
    lineJoin:'round'
  };
  var polyline=L.polyline(w.pts,style);
  
  // Add flow direction indicator (arrow or annotation)
  var flowLabel=w.flow || 'N/A';
  var tooltip_text=w.name+' [Flow: '+flowLabel+']';
  if(w.flood_severity) tooltip_text+=' — '+w.flood_severity.toUpperCase()+' FLOOD SEVERITY';
  
  polyline.bindTooltip(tooltip_text,{direction:'top',sticky:true,className:'waterway-tooltip'});
  polyline.bindPopup(
    '<div class="pop"><div class="pop-title">'+w.name+'</div>'+
    '<div class="pop-stat"><span>Type</span><b>'+w.type+'</b></div>'+
    '<div class="pop-stat"><span>Flow Direction</span><b>'+flowLabel+'</b></div>'+
    '<div class="pop-stat"><span>Width (approx)</span><b>'+w.width+' px</b></div>'+
    (w.flood_severity?'<div class="pop-badge" style="background:'+borderMap[w.flood_severity]+'">'+w.flood_severity.toUpperCase()+'</div>':'')+
    '</div>',
    {maxWidth:280}
  );
  polyline.addTo(LG.waterways);
});

// ── ELEVATION ZONES (for understanding flood flow patterns) ─────────────────────
ELEVATION_ZONES.forEach(function(e){
  var html='<div class="pop"><div class="pop-title">'+e.name+'</div>'+
    '<div class="pop-stat"><span>Elevation Range</span><b>'+e.elev_min+' – '+e.elev_max+' ft</b></div>'+
    '<div class="pop-stat"><span>Zone Type</span><b>'+e.type.toUpperCase()+'</b></div>'+
    '<div class="pop-box info">'+e.desc+'</div></div>';
  
  var fillColor=e.color;
  if(e.type==='source') fillColor='rgba(26, 35, 126, .2)';
  else if(e.type==='transition') fillColor='rgba(63, 81, 181, .15)';
  else fillColor='rgba(187, 222, 251, .2)';
  
  L.polygon(e.coords,{fillColor:fillColor,color:e.color,weight:1,dashArray:'4,4',opacity:.6,fillOpacity:.25})
    .bindPopup(html,{maxWidth:290})
    .addTo(LG.elevation);
});

// ── CONTAMINATION SOURCES (Potential environmental hazards from flooding) ──────

// Septic systems
for(var island in CONTAMINATION_SOURCES.septic_oahu.concat(CONTAMINATION_SOURCES.septic_maui,CONTAMINATION_SOURCES.septic_kauai)){
  var items=CONTAMINATION_SOURCES.septic_oahu.concat(CONTAMINATION_SOURCES.septic_maui,CONTAMINATION_SOURCES.septic_kauai);
  items.forEach(function(s){
    var riskColor=contamRiskColor[s.risk.toLowerCase()]||'#fbc02d';
    var html='<div class="pop"><div class="pop-title">'+s.name+'</div>'+
      '<span class="pop-badge" style="background:'+riskColor+'">'+s.risk+' RISK</span>'+
      '<div class="pop-stat"><span>Septic Systems</span><b>~'+s.systems+'</b></div>'+
      '<div class="pop-stat"><span>Density</span><b>'+s.density+'</b></div>'+
      '<div class="pop-box danger">'+s.desc+'<br><br><b>Contamination Risk:</b> Inundated septic systems release raw sewage and pathogens into floodwater, creating immediate health hazards and long-term groundwater contamination.</div></div>';
    
    L.polygon(s.coords,{fillColor:'rgba(200,50,100,.3)',color:riskColor,weight:2,dashArray:'3,3',opacity:.85,fillOpacity:.3})
      .bindPopup(html,{maxWidth:290})
      .addTo(LG.contamination);
  });
}

// Landfills and waste facilities
CONTAMINATION_SOURCES.landfills.forEach(function(l){
  var riskColor=contamRiskColor[l.risk.toLowerCase()]||'#fbc02d';
  var statusLabel=l.status.charAt(0).toUpperCase()+l.status.slice(1);
  var html='<div class="pop"><div class="pop-title">'+l.name+'</div>'+
    '<span class="pop-badge" style="background:'+riskColor+'">'+l.risk+' RISK</span>'+
    '<div class="pop-stat"><span>Status</span><b>'+statusLabel+'</b></div>'+
    '<div class="pop-stat"><span>Type</span><b>'+l.type.replace(/_/g,' ')+'</b></div>'+
    '<div class="pop-box danger">'+l.desc+'<br><br><b>Flood Hazard:</b> Inundation can mobilize leachate from landfills, releasing heavy metals, organic compounds, and pathogens into groundwater and surface runoff.</div></div>';
  
  var icon_size=l.status==='closed'?10:14;
  var iconHtml='<div style="width:'+icon_size+'px;height:'+icon_size+'px;background:'+riskColor+';border-radius:50%;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.4)"></div>';
  var icon=L.divIcon({html:iconHtml,className:'',iconSize:[icon_size,icon_size],iconAnchor:[icon_size/2,icon_size/2]});
  
  L.marker([l.coords[0][0],l.coords[0][1]],{icon:icon})
    .bindPopup(html,{maxWidth:290})
    .addTo(LG.contamination);
});

// Industrial facilities
CONTAMINATION_SOURCES.industrial.forEach(function(ind){
  var riskColor=contamRiskColor[ind.risk.toLowerCase()]||'#fbc02d';
  var html='<div class="pop"><div class="pop-title">'+ind.name+'</div>'+
    '<span class="pop-badge" style="background:'+riskColor+'">'+ind.risk+' RISK</span>'+
    '<div class="pop-stat"><span>Type</span><b>'+ind.type.replace(/_/g,' ')+'</b></div>'+
    '<div class="pop-box danger">'+ind.desc+'<br><br><b>Chemical Hazard:</b> Industrial facilities may store chemicals, fuels, or hazardous materials vulnerable to flood damage and environmental release.</div></div>';
  
  L.polygon(ind.coords,{fillColor:'rgba(100,50,50,.25)',color:riskColor,weight:2,opacity:.75,fillOpacity:.25})
    .bindPopup(html,{maxWidth:290})
    .addTo(LG.contamination);
});

// Agricultural runoff zones
CONTAMINATION_SOURCES.agricultural.forEach(function(a){
  var riskColor=contamRiskColor[a.risk.toLowerCase()]||'#fbc02d';
  var html='<div class="pop"><div class="pop-title">'+a.name+'</div>'+
    '<span class="pop-badge" style="background:'+riskColor+'">'+a.risk+' RISK</span>'+
    '<div class="pop-stat"><span>Area</span><b>~'+a.area_acres+' acres</b></div>'+
    '<div class="pop-stat"><span>Primary Use</span><b>'+a.primary+'</b></div>'+
    '<div class="pop-box warn">'+a.desc+'<br><br><b>Water Quality Impact:</b> Agricultural runoff during flooding mobilizes pesticides, fertilizers, and sediment into waterways and groundwater.</div></div>';
  
  L.polygon(a.coords,{fillColor:'rgba(76,175,80,.2)',color:riskColor,weight:2,dashArray:'6,4',opacity:.7,fillOpacity:.2})
    .bindPopup(html,{maxWidth:290})
    .addTo(LG.contamination);
});

// Underground storage tanks (USTs)
CONTAMINATION_SOURCES.ust.forEach(function(u){
  var riskColor=contamRiskColor[u.risk.toLowerCase()]||'#fbc02d';
  var html='<div class="pop"><div class="pop-title">'+u.name+'</div>'+
    '<span class="pop-badge" style="background:'+riskColor+'">'+u.risk+' RISK</span>'+
    '<div class="pop-stat"><span>Total Tanks</span><b>'+u.count+'</b></div>'+
    '<div class="pop-stat"><span>Active Tanks</span><b>'+u.active+'</b></div>'+
    '<div class="pop-box danger">'+u.desc+'<br><br><b>Risk:</b> Underground storage tanks containing fuel or chemicals face structural stress during flooding and may leak contaminants.</div></div>';
  
  L.circleMarker([u.coords[0][0],u.coords[0][1]],{radius:8,fillColor:riskColor,color:riskColor,weight:2,opacity:.8,fillOpacity:.4})
    .bindPopup(html,{maxWidth:290})
    .addTo(LG.contamination);
});

// ── WATERSHED BOUNDARIES ───────────────────────────────────────────────────────
WS_BOUNDS.forEach(function(w){
  L.polygon(w.coords,{fillColor:'rgba(0,77,64,.15)',color:'#004D40',weight:1.5,dashArray:'5,4',fillOpacity:.15})
   .bindPopup('<div class="pop"><div class="pop-title">'+w.name+'</div><span class="pop-badge" style="background:#004D40">WATERSHED</span><div class="pop-box info">Approximate watershed boundary from Hawaii DLNR Division of Aquatic Resources watershed atlas. Full data at geoportal.hawaii.gov. Watershed boundaries define where rainfall drains — during extreme events, the entire watershed volume routes through stream channels that then overflow.</div></div>',{maxWidth:280})
   .addTo(LG.watersheds);
});

// ── ISLAND MARKERS ─────────────────────────────────────────────────────────────
ISLANDS.forEach(function(isl){
  var col=isl.color;
  var icon=L.divIcon({
    html:'<div style="background:'+col+';color:#fff;font-size:9px;font-weight:700;padding:3px 7px;border-radius:10px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid #fff">'+isl.name+'</div>',
    className:'',iconSize:[null,null],iconAnchor:[0,0]
  });
  L.marker([isl.lat,isl.lng],{icon:icon,interactive:false}).addTo(map);
});
