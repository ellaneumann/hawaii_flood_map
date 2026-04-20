const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('data.js', 'utf8');
const ctx = {};
vm.createContext(ctx);
new vm.Script(src).runInContext(ctx);
function lonlat(pt){ return [pt[1], pt[0]]; }
function poly(coords){ return {type:'Polygon', coordinates:[coords.map(lonlat)]}; }
function line(coords){ return {type:'LineString', coordinates:coords.map(lonlat)}; }
function point(lat, lng){ return {type:'Point', coordinates:[lng, lat]}; }
function feat(props, geom){ return {type:'Feature', properties:props, geometry:geom}; }
function write(name, features){ const obj={type:'FeatureCollection', features}; fs.mkdirSync('data/geojson',{recursive:true}); fs.writeFileSync('data/geojson/'+name, JSON.stringify(obj,null,2)); console.log('Written', name); }
function copyProps(obj){ const p={}; Object.keys(obj).forEach(k=>{ if(['coords','pts','lat','lng'].includes(k)) return; p[k]=obj[k];}); return p; }
const impact = ctx.IMPACT_ZONES.map(z => feat({name:z.name, rain:z.rain, rescued:z.rescued, desc:z.desc, severity:z.severity}, poly(z.coords)));
write('impact_zones.geojson', impact);
const evac = ctx.EVAC_ZONES.map(z => feat({name:z.name, reason:z.reason, residents:z.residents, source:z.source, desc:z.desc}, poly(z.coords)));
write('evacuation_zones.geojson', evac);
const dam = [feat({name:'Wahiawa Dam', type:'dam', desc:'120-year-old earthen dam, 5,500 evacuated', source:'Built-in map'}, point(21.503,-158.024))];
write('dam_sites.geojson', dam);
const rescue = ctx.RESCUES.map(r => feat({name:r.name, people_rescued:r.n, desc:r.desc}, point(r.lat,r.lng)));
write('rescue_sites.geojson', rescue);
const rain = ctx.RAIN_AREAS.map(r => feat({name:r.name, rain:r.rain}, poly(r.coords)));
write('rain_areas.geojson', rain);
const fema = ctx.FEMA_AREAS.map(a => feat({name:a.name}, poly(a.coords)));
write('fema_areas.geojson', fema);
const slr = ctx.SLR_AREAS.map(a => feat({name:a.name}, poly(a.coords)));
write('slr_areas.geojson', slr);
const waterways = ctx.WATERWAY_NETWORK.map(w => feat({name:w.name, type:w.type, flow:w.flow, flood_severity:w.flood_severity}, line(w.pts)));
write('waterway_network.geojson', waterways);
const watersheds = ctx.WS_BOUNDS.map(w => feat({name:w.name}, poly(w.coords)));
write('watersheds.geojson', watersheds);
const elevation = ctx.ELEVATION_ZONES.map(e => feat({name:e.name, type:e.type, elev_min:e.elev_min, elev_max:e.elev_max, desc:e.desc}, poly(e.coords)));
write('elevation_zones.geojson', elevation);
const contamination=[];
['septic_oahu','septic_maui','septic_kauai'].forEach(key=>{ if(!ctx.CONTAMINATION_SOURCES[key]) return; ctx.CONTAMINATION_SOURCES[key].forEach(s=> contamination.push(feat(Object.assign({category:'septic'}, copyProps(s)), poly(s.coords)))); });
['landfills','industrial','agricultural'].forEach(key=>{ if(!ctx.CONTAMINATION_SOURCES[key]) return; ctx.CONTAMINATION_SOURCES[key].forEach(s=> contamination.push(feat(Object.assign({category:key}, copyProps(s)), poly(s.coords)))); });
ctx.CONTAMINATION_SOURCES.ust.forEach(u=> contamination.push(feat(Object.assign({category:'ust'}, copyProps(u)), point(u.coords[0][0],u.coords[0][1]))));
write('contamination_sources.geojson', contamination);
const soils=[];
Object.keys(ctx.SOIL_DATA).forEach(island => ctx.SOIL_DATA[island].forEach(s => soils.push(feat(Object.assign({island:island}, copyProps(s)), poly(s.coords)))));
write('soil_areas.geojson', soils);
const atmos = ctx.ATMOSPHERIC_RIVERS.map(a => feat(Object.assign({}, copyProps(a)), line(a.pts)));
write('atmospheric_rivers.geojson', atmos);
const census = ctx.CENSUS_DATA.map(c => feat(Object.assign({}, copyProps(c)), poly(c.coords)));
write('census_zones.geojson', census);
const imperv = ctx.IMPERVIOUS_SURFACE.map(i => feat(Object.assign({}, copyProps(i)), poly(i.coords)));
write('impervious_zones.geojson', imperv);
const subs = ctx.SUBDIVISIONS.map(s => feat(Object.assign({}, copyProps(s)), poly(s.coords)));
write('flood_subdivisions.geojson', subs);
