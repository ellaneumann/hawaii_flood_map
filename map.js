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
  // Update all checkboxes for this layer (handles duplicates across tabs)
  ['chk-'+n,'chk-'+n+'-layers'].forEach(function(id){
    var el=document.getElementById(id);
    if(el){el.classList.toggle('on',LON[n]);el.innerHTML=LON[n]?'✓':'';}
  });
  if(LON[n])map.addLayer(LG[n]);else map.removeLayer(LG[n]);
  // Show/hide FVI legend
  if(n==='fvi'){var leg=document.getElementById('fvi-legend');if(leg)leg.style.display=LON[n]?'block':'none';}
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
  if(w.flood_severity) tooltip_text+=' · '+w.flood_severity.toUpperCase()+' FLOOD SEVERITY';
  
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
   .bindPopup('<div class="pop"><div class="pop-title">'+w.name+'</div><span class="pop-badge" style="background:#004D40">WATERSHED</span><div class="pop-box info">Approximate watershed boundary from Hawaii DLNR Division of Aquatic Resources watershed atlas. Full data at geoportal.hawaii.gov. Watershed boundaries define where rainfall drains. During extreme events, the entire watershed volume routes through stream channels that then overflow.</div></div>',{maxWidth:280})
   .addTo(LG.watersheds);
});

// ── OFFICIAL GIS DATA LOADER ──────────────────────────────────────────────────
// Swaps out the simplified placeholder shapes in data.js with three layers
// downloaded from real U.S. government APIs:
//   1. FEMA NFHL (National Flood Hazard Layer) — official 1%-annual-chance flood zones
//   2. USGS NHD+ High Resolution — every named stream channel on O'ahu
//   3. USGS Watershed Boundary Dataset (WBD HUC-10) — watershed drainage divides
//
// To refresh the files:  node fetch_real_data.js
// If a file is missing the original data.js placeholder stays in place quietly.

function fldZoneStyle(zone) {
  zone = (zone || '').trim();
  if (zone.startsWith('V'))   return { color: '#D81B60', fill: 'rgba(216,27,96,.35)' };   // coastal high-hazard (V zone — magenta, colorblind-safe)
  if (zone === 'AO' || zone === 'AH') return { color: '#1565C0', fill: 'rgba(21,101,192,.35)' };
  return { color: '#005F73', fill: 'rgba(0,95,115,.35)' };                                 // AE and other A zones
}

function streamStyle(order) {
  if (order >= 5) return { color: '#1E88E5', weight: 3.5 };
  if (order >= 4) return { color: '#1E88E5', weight: 2.5 };
  if (order >= 3) return { color: '#42A5F5', weight: 2.0 };
  return           { color: '#90CAF9', weight: 1.5 };
}

async function loadRealLayers() {
  const base = 'data/geojson/';

  // Tell the user why the FVI vs FEMA toggle is grayed out before the file arrives
  var fvsFemaNote = document.getElementById('fvivsfema-note');
  if (fvsFemaNote) fvsFemaNote.textContent = 'Loading FEMA zones (8.8 MB), available in a moment…';

  // 1. FEMA Special Flood Hazard Areas — replaces 8 hand-drawn rectangles
  try {
    const res = await fetch(base + 'fema_areas.geojson');
    if (!res.ok) throw new Error('file not found');
    const gj = await res.json();
    if (typeof setFEMAData === 'function') setFEMAData(gj); // hand to FVI comparison engine

    // Update the note so the user knows the toggle is now usable
    if (fvsFemaNote) {
      fvsFemaNote.textContent = 'FEMA zones ready. Click to compare with FVI.';
      fvsFemaNote.style.color = '#4e2a82';
    }
    LG.fema.clearLayers();
    L.geoJSON(gj, {
      style: function(feat) {
        var s = fldZoneStyle(feat.properties.FLD_ZONE);
        return { fillColor: s.fill, color: s.color, weight: 1.5, dashArray: '4,3', fillOpacity: 0.35, opacity: 0.85 };
      },
      onEachFeature: function(feat, layer) {
        var p   = feat.properties;
        var z   = (p.FLD_ZONE  || 'Unknown').trim();
        var sub = p.ZONE_SUBTY ? ' · ' + p.ZONE_SUBTY : '';
        layer.bindPopup(
          '<div class="pop">' +
          '<div class="pop-title">FEMA Flood Zone ' + z + '</div>' +
          '<span class="pop-badge" style="background:#005F73">FEMA SFHA</span>' +
          '<div class="pop-stat"><span>Zone</span><b>' + z + sub + '</b></div>' +
          (p.STUDY_TYP ? '<div class="pop-stat"><span>Study type</span><b>' + p.STUDY_TYP + '</b></div>' : '') +
          '<div class="pop-box info">1% annual-chance Special Flood Hazard Area. ' +
          'Source: FEMA NFHL, DFIRM Dec 2025. Mandatory flood insurance applies in this zone.</div>' +
          '<a href="https://fhat.hawaii.gov/" target="_blank" style="font-size:10px;display:block;margin-top:6px">Open Hawaii Flood Hazard Assessment Tool →</a>' +
          '</div>',
          { maxWidth: 290 }
        );
      }
    }).addTo(LG.fema);
  } catch (_) {
    // File missing — likely fetch_real_data.js hasn't been run yet
    if (fvsFemaNote) {
      fvsFemaNote.textContent = 'FEMA file not found — run: node fetch_real_data.js';
      fvsFemaNote.style.color = '#c0392b';
    }
  }

  // 2. NHD stream flowlines — replaces 12 hand-traced polylines
  try {
    const res = await fetch(base + 'waterway_network.geojson');
    if (!res.ok) throw new Error('file not found');
    const gj = await res.json();
    LG.waterways.clearLayers();
    L.geoJSON(gj, {
      style: function(feat) {
        var s = streamStyle(feat.properties.streamorde || feat.properties.StreamOrde || 2);
        return { color: s.color, weight: s.weight, opacity: 0.8, lineCap: 'round', lineJoin: 'round' };
      },
      onEachFeature: function(feat, layer) {
        var p    = feat.properties;
        var name = p.GNIS_Name || 'Unnamed stream';
        var ord  = p.streamorde || p.StreamOrde || 'N/A';
        var type = p.FTYPE === 460 ? 'Stream / River' : p.FTYPE === 558 ? 'Artificial path' : 'Stream';
        layer.bindTooltip(name, { direction: 'top', sticky: true, className: 'waterway-tooltip' });
        layer.bindPopup(
          '<div class="pop"><div class="pop-title">' + name + '</div>' +
          '<div class="pop-stat"><span>Stream order</span><b>' + ord + '</b></div>' +
          '<div class="pop-stat"><span>Type</span><b>' + type + '</b></div>' +
          '<div class="pop-box info">Source: USGS NHD+ High Resolution (National Hydrography Dataset). ' +
          'Higher stream order = larger, higher-capacity channel.</div>' +
          '</div>',
          { maxWidth: 280 }
        );
      }
    }).addTo(LG.waterways);

    // ── Feed real NHD+ stream geometry into the Flood Vulnerability Index ──────
    // The FVI calculates a "stream proximity" score for every grid cell — how
    // close are you to the nearest stream that can flood?
    //
    // Before this step, the FVI used 12 hand-drawn approximate stream lines.
    // Here we extract the real NHD+ channels and hand them to vulnerability.js
    // so the FVI score is based on actual USGS-surveyed geometry.
    //
    // We only include stream order ≥ 3. Stream order is a measure of how large
    // a stream is: order 1 = tiny headwater trickle, order 6+ = major river.
    // Order 3 is the first tier that has at least two tributaries flowing in —
    // these are the channels that can actually overflow into neighborhoods.
    // Keeping only order ≥ 3 (roughly 200 streams on O'ahu) also keeps the
    // FVI computation fast — each of 19,000 grid cells checks every stream.
    //
    // Each stream is also subsampled to at most 8 coordinate vertices so we
    // preserve the general shape without multiplying check counts.
    var fviLines = [];
    gj.features.forEach(function(feat) {
      var ord = feat.properties.streamorde || feat.properties.StreamOrde || 1;
      if (ord < 3) return; // skip tiny headwaters
      var geom = feat.geometry;
      if (!geom) return;
      var segs = geom.type === 'MultiLineString' ? geom.coordinates : [geom.coordinates];
      segs.forEach(function(seg) {
        if (seg.length < 2) return;
        // GeoJSON stores coords as [longitude, latitude]; the FVI uses [latitude, longitude]
        var step = Math.max(1, Math.floor(seg.length / 8));
        var pts = [];
        for (var i = 0; i < seg.length; i += step) {
          pts.push([seg[i][1], seg[i][0]]);
        }
        var last = seg[seg.length - 1];
        if (pts[pts.length - 1][0] !== last[1] || pts[pts.length - 1][1] !== last[0]) {
          pts.push([last[1], last[0]]);
        }
        fviLines.push(pts);
      });
    });
    if (typeof updateFVIStreams === 'function' && fviLines.length > 0) {
      updateFVIStreams(fviLines);
    }
  } catch (_) { /* keep data.js placeholder */ }

  // 3. WBD HUC-10 watershed boundaries — replaces 4 hand-drawn rectangles
  try {
    const res = await fetch(base + 'watersheds.geojson');
    if (!res.ok) throw new Error('file not found');
    const gj = await res.json();
    LG.watersheds.clearLayers();
    L.geoJSON(gj, {
      style: function() {
        return { fillColor: 'rgba(0,77,64,.1)', color: '#004D40', weight: 2, dashArray: '8,5', fillOpacity: 0.1, opacity: 0.7 };
      },
      onEachFeature: function(feat, layer) {
        var p = feat.properties;
        layer.bindPopup(
          '<div class="pop"><div class="pop-title">' + (p.name || 'Watershed') + '</div>' +
          '<span class="pop-badge" style="background:#004D40">WBD HUC-10</span>' +
          '<div class="pop-stat"><span>HUC-10 code</span><b>' + (p.huc10 || p.huc8 || 'N/A') + '</b></div>' +
          (p.areasqkm ? '<div class="pop-stat"><span>Area</span><b>' + Math.round(p.areasqkm) + ' km²</b></div>' : '') +
          '<div class="pop-box info">Watershed boundary from USGS Watershed Boundary Dataset (WBD HUC-10). ' +
          'All rainfall inside this boundary drains to the same stream outlet.</div>' +
          '</div>',
          { maxWidth: 270 }
        );
      }
    }).addTo(LG.watersheds);
  } catch (_) { /* keep data.js placeholder */ }
}

// Run on page load — falls back silently to data.js layers if files are absent
loadRealLayers();

// ── COMMUNITY BOUNDARY LOADER ──────────────────────────────────────────────────
// Replaces rectangular placeholder polygons in IMPACT_ZONES, EVAC_ZONES, and
// RAIN_AREAS with real US Census CDP (Census Designated Place) boundary shapes.
//
// Strategy (two-stage):
//   1. Try the locally cached file data/geojson/hawaii_places.geojson (fast, offline).
//      Generate it with:  node fetch_real_data.js
//   2. If file is absent, query the Census TIGER REST API directly in the browser,
//      fetching ONLY the specific place names we need (targeted query, ~10–30 KB).
//
// ZONE_PLACE_NAMES maps each event zone name to one or more Census CDP names.
// Multiple CDPs are merged into one multi-polygon for zones spanning communities.
// Zones with no Census CDP match (e.g. mountain ranges) keep their rectangle.
//
// Census source: tigerWMS_Census2020 MapServer layer 16 (Places)
//   https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/16

var ZONE_PLACE_NAMES = {
  // ── Impact zones ────────────────────────────────────────────────────────────
  'Waialua / Haleiwa, Oahu North Shore': ['Waialua', 'Haleiwa'],
  'Wahiawa / Central Oahu':              ['Wahiawa'],
  'Pupukea / North Shore Oahu':          ['Pupukea'],
  'Mānoa / Pālolo, Honolulu':           ['Manoa', 'Palolo'],
  'Waianae / West Oahu':                 ['Waianae', 'Makaha'],
  'Lahaina, West Maui':                  ['Lahaina'],
  'Kula / Upcountry Maui':              ['Kula'],
  'Pahala, Big Island South':            ['Pahala'],
  'Hilo, Big Island East':               ['Hilo'],
  'South Kauai / Kauai Channel':         ['Koloa', 'Lihue'],
  'Honolimaloo, Molokai':                ['Kaunakakai'],
  // ── Evacuation zones ────────────────────────────────────────────────────────
  // North Shore evac spans Waialua, Haleiwa, and Mokuleia (all downstream of dam)
  'North Shore Oahu Evacuation (Dam Failure Risk)': ['Waialua', 'Haleiwa', 'Mokuleia'],
  // West side evac: Mokuleia coastal strip + upper Waialua agricultural areas
  'West Oahu Evacuation (Downstream Risk)':         ['Waialua', 'Mokuleia'],
  'Manoa/Palolo Evacuation (Stream Flooding)':      ['Manoa', 'Palolo'],
  // Pearl Harbor area: Aiea Stream floodplain + adjacent residential
  'Pearl Harbor Area (Aiea Bridge Risk)':            ['Aiea', 'Pearl City'],
  'Lahaina Evacuation Warning (Maui)':              ['Lahaina'],
  'Kula/Upcountry Maui (Hospitals & High Ground)': ['Kula'],
  'Wailua River Basin Evacuation (Kauai)':          ['Kapaa'],
  'Hanalei Area Evacuation (North Shore Kauai)':    ['Hanalei'],
  // ── Rainfall areas ──────────────────────────────────────────────────────────
  'Oahu North Shore (Storm 2 peak)':    ['Waialua', 'Haleiwa', 'Pupukea', 'Kahuku'],
  'Molokai (all stations)':             ['Kaunakakai', 'Maunaloa'],
  'Lanai':                              ['Lanai City'],
  'Hilo / Pahala Big Island':           ['Hilo', 'Pahala', 'Keaau'],
  'Kauai South / Kauai Channel':        ['Lihue', 'Koloa'],
};

// ── Helpers shared by both render paths ──────────────────────────────────────

// Normalizes a place name for fuzzy matching: lowercase, strip diacritics
// (Hawaiian macrons ā/ē/ī/ō/ū), okina, and punctuation variants.
// Census TIGER 2020 uses mixed conventions — some CDPs have macrons, some don't.
function _normName(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[āÄ]/g, 'a').replace(/[ēĒ]/g, 'e')
    .replace(/[īĪ]/g, 'i').replace(/[ōŌ]/g, 'o')
    .replace(/[ūŪ]/g, 'u')
    .replace(/[ʻʼ'''`']/g, '')   // okina and apostrophe variants
    .replace(/[-\s]+/g, ' ')      // normalize hyphens/spaces
    .trim();
}

function _geomToRings(geom) {
  var rings = [];
  var polys = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates];
  polys.forEach(function(poly) {
    poly.forEach(function(ring) {
      rings.push(ring.map(function(c) { return [c[1], c[0]]; }));
    });
  });
  return rings;
}

function _buildIndex(features) {
  var idx = {};
  features.forEach(function(f) {
    if (!f.geometry) return;
    var key = _normName(f.properties.NAME || f.properties.name || '');
    if (!idx[key]) idx[key] = f.geometry;
  });
  return idx;
}

function _getRealCoords(zoneName, byName) {
  var placeNames = ZONE_PLACE_NAMES[zoneName];
  if (!placeNames) return null;
  var allRings = [];
  placeNames.forEach(function(pname) {
    var geom = byName[_normName(pname)];
    if (geom) allRings = allRings.concat(_geomToRings(geom));
  });
  return allRings.length > 0 ? allRings : null;
}

function _renderZones(byName) {
  // Impact zones
  LG.impact.clearLayers();
  IMPACT_ZONES.forEach(function(z) {
    var coords = _getRealCoords(z.name, byName) || [z.coords];
    var html = '<div class="pop"><div class="pop-title">' + z.name + '</div>';
    html += '<span class="pop-badge" style="background:' + borderMap[z.severity] + '">' + z.severity.toUpperCase() + '</span>';
    html += '<div class="pop-stat"><span>Peak rainfall</span><b>' + z.rain + '</b></div>';
    if (z.rescued) html += '<div class="pop-stat"><span>People rescued</span><b>' + z.rescued + '</b></div>';
    html += '<div class="pop-box ' + (z.severity === 'moderate' ? 'warn' : 'danger') + '">' + z.desc + '</div></div>';
    L.polygon(coords, {
      fillColor: colMap[z.severity], color: borderMap[z.severity],
      weight: 2, opacity: .85, fillOpacity: .55
    }).bindPopup(html, {maxWidth: 290}).addTo(LG.impact);
  });

  // Evacuation zones
  LG.evac.clearLayers();
  EVAC_ZONES.forEach(function(z) {
    var coords = _getRealCoords(z.name, byName) || [z.coords];
    var html = '<div class="pop"><div class="pop-title">' + z.name + '</div>' +
      '<span class="pop-badge" style="background:#7B2D8B">EVACUATION</span>' +
      '<div class="pop-box warn">' + z.desc + '</div></div>';
    L.polygon(coords, {
      fillColor: 'rgba(123,45,139,.35)', color: '#7B2D8B',
      weight: 2, dashArray: '8,4', opacity: .85, fillOpacity: .35
    }).bindPopup(html, {maxWidth: 290}).addTo(LG.evac);
  });

  // Rainfall areas
  LG.rain.clearLayers();
  RAIN_AREAS.forEach(function(r) {
    var coords = _getRealCoords(r.name, byName) || [r.coords];
    L.polygon(coords, {
      fillColor: 'rgba(30,136,229,.2)', color: '#1E88E5',
      weight: 1.5, dashArray: '6,4', fillOpacity: .2
    }).bindPopup(
      '<div class="pop"><div class="pop-title">' + r.name + '</div>' +
      '<div class="pop-stat"><span>Rainfall (event total)</span><b>' + r.rain + '</b></div>' +
      '<div class="pop-box info">Extreme rainfall area from NWS HFO March 2026 rainfall summaries. Areas shown received more than 10 inches during the combined Kona low event period (March 10 to 24).</div></div>',
      {maxWidth: 280}
    ).addTo(LG.rain);
  });
}

async function loadPlaceBoundaries() {
  var features = null;

  // ── Stage 1: try local cached file ──────────────────────────────────────────
  try {
    var localRes = await fetch('data/geojson/hawaii_places.geojson');
    if (localRes.ok) {
      var gj = await localRes.json();
      features = gj.features;
    }
  } catch(_) {}

  // ── Stage 2: targeted Census TIGER API query ─────────────────────────────────
  // Only fires if local file is missing. Queries only the specific CDP names we
  // need instead of all ~200 Hawaii places (saves ~8 MB of download).
  if (!features) {
    try {
      var needed = {};
      Object.values(ZONE_PLACE_NAMES).forEach(function(names) {
        names.forEach(function(n) { needed[n] = true; });
      });
      var nameClause = Object.keys(needed).map(function(n) {
        return "NAME='" + n.replace(/'/g, "''") + "'";
      }).join(' OR ');

      var qs = new URLSearchParams({
        where:     "STATE='15' AND (" + nameClause + ")",
        outFields: 'NAME,GEOID',
        f:         'geojson',
        outSR:     '4326'
      });
      var apiRes = await fetch(
        'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/16/query?' + qs
      );
      if (apiRes.ok) {
        var apiGJ = await apiRes.json();
        features = apiGJ.features;
      }
    } catch(_) {}
  }

  if (!features || features.length === 0) {
    console.warn('FloodWatch: Census boundary fetch returned no features. Zones will use rectangular placeholders.');
    return;
  }

  var idx = _buildIndex(features);

  // Debug: log any ZONE_PLACE_NAMES entries that produced no geometry match
  Object.keys(ZONE_PLACE_NAMES).forEach(function(zone) {
    var matched = ZONE_PLACE_NAMES[zone].some(function(n) { return !!idx[_normName(n)]; });
    if (!matched) console.warn('FloodWatch: no Census match for "' + zone + '" (tried: ' + ZONE_PLACE_NAMES[zone].join(', ') + ')');
  });

  _renderZones(idx);
}

loadPlaceBoundaries();

// ── ISLAND MARKERS ─────────────────────────────────────────────────────────────
ISLANDS.forEach(function(isl){
  var col=isl.color;
  var icon=L.divIcon({
    html:'<div style="background:'+col+';color:#fff;font-size:9px;font-weight:700;padding:3px 7px;border-radius:10px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid #fff">'+isl.name+'</div>',
    className:'',iconSize:[null,null],iconAnchor:[0,0]
  });
  L.marker([isl.lat,isl.lng],{icon:icon,interactive:false}).addTo(map);
});
