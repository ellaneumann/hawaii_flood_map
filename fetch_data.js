#!/usr/bin/env node
/**
 * fetch_data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Downloads real geographic data from official public REST APIs and saves it
 * to data/geojson/ so the map can load it instead of simplified placeholders.
 *
 * Run once:  node fetch_data.js
 * Requires:  Node.js 12+ (uses built-in https — no npm install needed)
 *
 * What it downloads:
 *   data/geojson/fema_areas.geojson       ← FEMA NFHL (official DFIRM flood zones)
 *   data/geojson/waterway_network.geojson  ← USGS NHD+ HR (real stream flowlines)
 *   data/geojson/watersheds.geojson        ← USGS WBD HUC-10 (watershed boundaries)
 *   data/geojson/hawaii_places.geojson     ← US Census TIGER (community boundaries)
 *   data/geojson/dams.geojson             ← Hawaii State GIS / NID (all Hawaii dams)
 *   data/geojson/osds.geojson             ← Hawaii DOH (Oahu onsite sewage disposal systems)
 *   data/geojson/slr_real.geojson         ← Hawaii State GIS / UH (SLR 3.2ft flood zones)
 *   data/geojson/soil_oahu.geojson        ← USDA NRCS SSURGO via Hawaii State GIS (Oahu soils)
 *
 * All sources are official U.S. government or Hawaii state data, public domain.
 */

const fs    = require('fs');
const https = require('https');
const path  = require('path');
const OUT   = path.join(__dirname, 'data', 'geojson');

// ── HTTP helper ────────────────────────────────────────────────────────────────

function getJSON(url, redirects, retries) {
  redirects = redirects === undefined ? 3 : redirects;
  retries   = retries   === undefined ? 4 : retries;
  return new Promise(function(resolve, reject) {
    https.get(url, { headers: { 'User-Agent': 'Hawaii-FloodWatch/1.0' } }, function(res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (redirects === 0) return reject(new Error('Too many redirects'));
        return resolve(getJSON(res.headers.location, redirects - 1, retries));
      }
      if (res.statusCode !== 200) {
        return reject(new Error('HTTP ' + res.statusCode + ' from ' + url));
      }
      var body = '';
      res.on('data', function(chunk) { body += chunk; });
      res.on('end', function() {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('JSON parse error: ' + e.message)); }
      });
    }).on('error', function(err) {
      if (retries > 0) {
        var delay = (5 - retries) * 2000; // 2s, 4s, 6s, 8s back-off
        process.stdout.write('\r  [retry in ' + (delay/1000) + 's after ' + err.code + '] ');
        setTimeout(function() { resolve(getJSON(url, redirects, retries - 1)); }, delay);
      } else {
        reject(err);
      }
    });
  });
}

// ── USDA Soil Data Access (SDA) tabular POST query ────────────────────────────
// Used to join hydrologic soil group (HSG) onto SSURGO map unit polygons.
// Endpoint: sdmdataaccess.nrcs.usda.gov/tabular/post.rest

function sdaQuery(sql) {
  return new Promise(function(resolve, reject) {
    var body = 'query=' + encodeURIComponent(sql) + '&format=JSON';
    var opts = {
      hostname: 'sdmdataaccess.nrcs.usda.gov',
      path:     '/tabular/post.rest',
      method:   'POST',
      headers: {
        'Content-Type':   'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent':     'Hawaii-FloodWatch/1.0'
      }
    };
    var req = https.request(opts, function(res) {
      var data = '';
      res.on('data', function(c) { data += c; });
      res.on('end', function() {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('SDA JSON parse error: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Paginated ArcGIS REST query → GeoJSON FeatureCollection ───────────────────

async function arcgisQuery(serviceUrl, params, label) {
  var features = [];
  var offset   = 0;
  var PAGE     = 1000;

  while (true) {
    var qs = new URLSearchParams(Object.assign({
      f:                 'geojson',
      outSR:             '4326',
      returnGeometry:    'true',
      resultRecordCount: String(PAGE),
      resultOffset:      String(offset),
    }, params));

    var url  = serviceUrl + '/query?' + qs.toString();
    var data = await getJSON(url);

    if (data.error) throw new Error('ArcGIS error: ' + JSON.stringify(data.error));

    var batch = data.features || [];
    features  = features.concat(batch);
    process.stdout.write('\r  ' + label + ': ' + features.length + ' features…');

    if (batch.length < PAGE) break;
    offset += PAGE;
  }

  process.stdout.write('\n');
  return { type: 'FeatureCollection', features: features };
}

function save(name, fc) {
  var fp = path.join(OUT, name);
  fs.writeFileSync(fp, JSON.stringify(fc, null, 2));
  console.log('  Saved → data/geojson/' + name + '  (' + fc.features.length + ' features)');
}

// ── Bounding boxes ─────────────────────────────────────────────────────────────

var OAHU_BOX   = { xmin: -158.35, ymin: 21.20, xmax: -157.60, ymax: 21.75, spatialReference: { wkid: 4326 } };
var HAWAII_ALL = { xmin: -160.30, ymin: 18.80, xmax: -154.70, ymax: 22.30, spatialReference: { wkid: 4326 } };

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  // 1. FEMA Special Flood Hazard Areas
  // ─────────────────────────────────
  // Source: FEMA National Flood Hazard Layer (NFHL)
  //   https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer
  //
  // Layer 28 = S_FLD_HAZ_AR (flood hazard area polygons).
  // SFHA_TF = 'T' keeps only the 1% annual-chance (100-year) Special Flood
  // Hazard Areas (A* and V* zones) and excludes Zone X (low/minimal hazard).

  console.log('\n[1/8] FEMA Special Flood Hazard Areas');
  console.log('       Source: hazards.fema.gov — DFIRM December 2025\n');

  var fema = await arcgisQuery(
    'https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28',
    {
      geometry:           JSON.stringify(HAWAII_ALL),
      geometryType:       'esriGeometryEnvelope',
      inSR:               '4326',
      spatialRel:         'esriSpatialRelIntersects',
      where:              "SFHA_TF = 'T'",
      outFields:          'FLD_ZONE,ZONE_SUBTY,SFHA_TF,STUDY_TYP',
      maxAllowableOffset: '0.0002',
    },
    'FEMA SFHA'
  );
  save('fema_areas.geojson', fema);

  // 2. NHD+ HR Stream Flowlines — O'ahu
  // ─────────────────────────────────────
  // Source: USGS NHDPlus High Resolution
  //   https://hydro.nationalmap.gov/arcgis/rest/services/NHDPlus_HR/MapServer
  //
  // Layer 3 = NetworkNHDFlowline. ftype 460 = StreamRiver, 558 = ArtificialPath.
  // streamorde >= 2 filters out tiny headwater rills.

  console.log('\n[2/8] NHD+ HR stream flowlines (O\'ahu)');
  console.log('       Source: hydro.nationalmap.gov — NHDPlus High Resolution\n');

  var streams = await arcgisQuery(
    'https://hydro.nationalmap.gov/arcgis/rest/services/NHDPlus_HR/MapServer/3',
    {
      geometry:     JSON.stringify(OAHU_BOX),
      geometryType: 'esriGeometryEnvelope',
      inSR:         '4326',
      spatialRel:   'esriSpatialRelIntersects',
      where:        'ftype IN (460, 558) AND streamorde >= 2',
      outFields:    'gnis_name,ftype,fcode,streamorde,lengthkm',
    },
    'NHD Streams'
  );
  save('waterway_network.geojson', streams);

  // 3. Watershed Boundary Dataset — HUC-10, Hawaii
  // ────────────────────────────────────────────────
  // Source: USGS WBD — https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer
  // Layer 5 = WBDHU10. Hawaii has 62 HUC-10 sub-watershed units.

  console.log('\n[3/8] Watershed boundaries (USGS WBD HUC-10) — Hawaii');
  console.log('       Source: hydro.nationalmap.gov — Watershed Boundary Dataset\n');

  var ws = await arcgisQuery(
    'https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/5',
    {
      where:              "states LIKE '%HI%'",
      outFields:          'name,huc10,areasqkm,states',
      maxAllowableOffset: '0.0005',
    },
    'WBD HUC-10'
  );
  save('watersheds.geojson', ws);

  // 4. Census TIGER CDP Boundaries — Hawaii places
  // ────────────────────────────────────────────────
  // Source: US Census Bureau TIGER/Web (Census 2020) — layer 16 = Places.
  // STATE = '15' is Hawaii's FIPS code.

  console.log('\n[4/8] Census TIGER community boundaries (Hawaii CDPs)');
  console.log('       Source: US Census Bureau TIGERweb — Census 2020 places\n');

  var places = await arcgisQuery(
    'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/16',
    {
      where:     "STATE='15'",
      outFields: 'NAME,GEOID',
    },
    'Census Places'
  );
  save('hawaii_places.geojson', places);

  // 5. Hawaii Dam Inventory
  // ────────────────────────
  // Source: Hawaii Statewide GIS Program — Infrastructure/MapServer/10
  //   https://geodata.hawaii.gov/arcgis/rest/services/Infrastructure/MapServer
  //
  // Layer 10 = Dams (point). Records synced with USACE National Inventory of
  // Dams (NID). Covers all inventoried dams on all Hawaiian Islands.
  //
  // Key attributes:
  //   dam_name                  — official NID name
  //   dam_height                — height in feet
  //   downstream_hazard_potential — H (high: life loss expected if failure),
  //                                 S (significant), L (low)
  //   condition_assessment      — SATISFACTORY / FAIR / POOR / UNSATISFACTORY
  //   year_completed            — construction year
  //   owner_name                — current owner
  //   river_or_stream           — stream the dam impounds
  //   operational_status        — current operational state
  //   nid_id                    — USACE NID identifier (e.g. HI00001)
  //
  // Replaces the single hand-coded Wahiawa Dam marker in data.js.

  console.log('\n[5/8] Hawaii dam inventory');
  console.log('       Source: geodata.hawaii.gov — Infrastructure/MapServer/10\n');

  var dams = await arcgisQuery(
    'https://geodata.hawaii.gov/arcgis/rest/services/Infrastructure/MapServer/10',
    {
      outFields: 'dam_name,dam_height,downstream_hazard_potential,condition_assessment,year_completed,owner_name,river_or_stream,operational_status,nid_id',
    },
    'Dams'
  );
  save('dams.geojson', dams);

  // 6. Onsite Sewage Disposal Systems — Oahu (high-risk)
  // ──────────────────────────────────────────────────────
  // Source: Hawaii Department of Health via Hawaii Statewide GIS Program
  //   https://geodata.hawaii.gov/arcgis/rest/services/Infrastructure/MapServer
  //
  // Layer 22 = Oahu OSDS (parcel-level cesspools and septic systems).
  // rsk_score 1–5 scale: 5 = highest contamination risk to groundwater and
  // coastal waters. Filtering to score >= 4 targets the systems most likely
  // to release pathogens and nutrients into floodwater.
  //
  // Key attributes:
  //   type       — CESSPOOL or SEPTIC
  //   osds_class — Class I–V (IV and V are cesspools, most hazardous)
  //   rsk_score  — composite contamination risk score (1–5)
  //   towns      — community/neighborhood name
  //   cp_qty     — number of cesspool units on the parcel
  //   cp_n       — estimated nitrogen load (lbs/year)
  //   cp_p       — estimated phosphorus load (lbs/year)
  //   cp_fc      — estimated fecal coliform load (MPN/year)
  //
  // Note: layers 23–26 cover Maui, Hawaii, Kauai, and Molokai respectively
  // but have different field schemas. Oahu (layer 22) is prioritized because
  // that is the focus of the FVI and 2026 event documentation.

  console.log('\n[6/8] Oahu OSDS / cesspools (risk score >= 4)');
  console.log('       Source: geodata.hawaii.gov — Infrastructure/MapServer/22\n');

  var osds = await arcgisQuery(
    'https://geodata.hawaii.gov/arcgis/rest/services/Infrastructure/MapServer/22',
    {
      where:     'rsk_score >= 4',
      outFields: 'type,osds_class,rsk_score,towns,cp_qty,cp_n,cp_p,cp_fc',
    },
    'OSDS Oahu'
  );
  save('osds.geojson', osds);

  // 7. Sea Level Rise 3.2ft Coastal Flood Zones — Statewide
  // ─────────────────────────────────────────────────────────
  // Source: UH Coastal Geology Group (HAZUS model) via Hawaii Statewide GIS Program
  //   https://geodata.hawaii.gov/arcgis/rest/services/Hazards/MapServer
  //
  // Layer 15 = 1% annual-chance coastal flood zone with 3.2 feet of sea level rise.
  // This is the official state GIS dataset underlying the Hawaii Flood Hazard
  // Assessment Tool (fhat.hawaii.gov) and NOAA coastal planning projections.
  //
  // maxAllowableOffset=0.0003 (~33m) simplifies the dense coastal geometry
  // so the file loads in a browser without a long wait.
  //
  // Replaces the 6 hand-drawn rectangles in data.js SLR_AREAS.
  // Saved as slr_real.geojson (not slr_areas.geojson) so the fetch run is
  // detectable by map.js and does not conflict with gen_geojson.js output.

  console.log('\n[7/8] SLR 3.2ft coastal flood zones — Statewide');
  console.log('       Source: geodata.hawaii.gov — Hazards/MapServer/15\n');

  var slr = await arcgisQuery(
    'https://geodata.hawaii.gov/arcgis/rest/services/Hazards/MapServer/15',
    {
      outFields:          '*',
      maxAllowableOffset: '0.003', // ~333m — keeps file under 5MB; 0.0003 produces 143MB
    },
    'SLR 3.2ft'
  );
  save('slr_real.geojson', slr);

  // 8. SSURGO Soil Map Unit Polygons — Oahu
  // ─────────────────────────────────────────
  // Source: USDA NRCS SSURGO via Hawaii Statewide GIS Program — Terrestrial/MapServer/42
  //   https://geodata.hawaii.gov/arcgis/rest/services/Terrestrial/MapServer
  //
  // Layer 42 = "Soils (MU) Polygons/Areas - State of Hawaii" (SSURGO Nov 2023).
  // Each polygon represents one soil map unit (MU) with a unique map unit key (mukey).
  //
  // Key attributes:
  //   musym      — soil map unit symbol (e.g. "WaC" = Waialua silty clay loam C slope)
  //   mukey      — primary key for joining with USDA Soil Data Access (SDA) tabular DB
  //   areasymbol — soil survey area identifier (e.g. "HI009" = Oahu)
  //
  // Note: hydrologic group (A/B/C/D) is not stored in the geometry layer — it
  // requires a JOIN using mukey against the USDA SDA tabular service at
  // https://sdmdataaccess.nrcs.usda.gov/ (POST endpoint). The FVI's soil drainage
  // factor can be upgraded to use these real polygon boundaries once the join is
  // implemented in vulnerability.js.
  //
  // Filtered to Oahu bounding box — statewide layer is too large for browser delivery.
  // maxAllowableOffset=0.0001 (~11m) preserves field-level polygon detail.
  // Saved as soil_oahu.geojson to avoid conflicting with gen_geojson.js output.

  console.log('\n[8/8] SSURGO soil polygons — Oahu');
  console.log('       Source: geodata.hawaii.gov — Terrestrial/MapServer/42\n');

  var soils = await arcgisQuery(
    'https://geodata.hawaii.gov/arcgis/rest/services/Terrestrial/MapServer/42',
    {
      geometry:           JSON.stringify(OAHU_BOX),
      geometryType:       'esriGeometryEnvelope',
      inSR:               '4326',
      spatialRel:         'esriSpatialRelIntersects',
      outFields:          'musym,mukey,areasymbol',
      maxAllowableOffset: '0.0001',
    },
    'SSURGO Soils'
  );
  // Join hydrologic soil group (HSG) from USDA Soil Data Access (SDA)
  // muaggatt.hydgrp = dominant HSG (A/B/C/D) for each map unit
  // Source: Soil Survey Staff, NRCS — sdmdataaccess.nrcs.usda.gov
  var mukeys = [];
  var seen = {};
  soils.features.forEach(function(f) {
    var mk = String(f.properties.mukey || '');
    if (mk && !seen[mk]) { seen[mk] = true; mukeys.push(mk); }
  });

  console.log('\n  Joining HSG from USDA SDA (' + mukeys.length + ' map units)…');
  var hsgMap = {};
  try {
    // SDA has no URL length limit but batch in 500s to be safe
    var BATCH = 500;
    for (var b = 0; b < mukeys.length; b += BATCH) {
      var chunk = mukeys.slice(b, b + BATCH);
      var sda = await sdaQuery(
        'SELECT mukey, hydgrp FROM muaggatt WHERE mukey IN (' + chunk.join(',') + ')'
      );
      if (sda && sda.Table) {
        sda.Table.forEach(function(row) { hsgMap[String(row[0])] = row[1]; });
      }
    }
    soils.features.forEach(function(f) {
      f.properties.hydgrp = hsgMap[String(f.properties.mukey)] || null;
    });
    var matched = soils.features.filter(function(f) { return f.properties.hydgrp; }).length;
    console.log('  HSG matched: ' + matched + ' of ' + soils.features.length + ' polygons');
  } catch(e) {
    console.warn('  SDA HSG join failed (' + e.message + ') — file saved without hydgrp');
  }

  // Join free iron oxide content (chchemical.freeiron) from USDA SDA
  // freeiron = free iron oxides, % by weight, averaged across all horizons of the dominant component
  // Normalized to 0–1 using 35% as max (observed ceiling for Hawaiian Oxisols/pineapple soils)
  // Source: Soil Survey Staff, NRCS, USDA. SSURGO chchemical table.
  //   sdmdataaccess.nrcs.usda.gov
  console.log('\n  Joining free iron oxide from USDA SDA chchemical…');
  var ironMap = {};
  try {
    for (var bi = 0; bi < mukeys.length; bi += BATCH) {
      var ichunk = mukeys.slice(bi, bi + BATCH);
      var ironSda = await sdaQuery(
        'SELECT mu.mukey, AVG(cc.freeiron) AS freeiron ' +
        'FROM mapunit mu ' +
        'INNER JOIN component co ON mu.mukey = co.mukey AND co.majcompflag = \'Yes\' ' +
        'INNER JOIN chorizon ch ON co.cokey = ch.cokey ' +
        'INNER JOIN chchemical cc ON ch.chkey = cc.chkey ' +
        'WHERE mu.mukey IN (' + ichunk.join(',') + ') ' +
        'AND cc.freeiron IS NOT NULL ' +
        'GROUP BY mu.mukey'
      );
      if (ironSda && ironSda.Table) {
        ironSda.Table.forEach(function(row) {
          ironMap[String(row[0])] = parseFloat(row[1]) || 0;
        });
      }
    }
    soils.features.forEach(function(f) {
      var fe = ironMap[String(f.properties.mukey)];
      f.properties.iron_score = (fe != null) ? Math.min(1, fe / 35) : null;
    });
    var ironMatched = soils.features.filter(function(f) { return f.properties.iron_score != null; }).length;
    console.log('  Iron oxide matched: ' + ironMatched + ' of ' + soils.features.length + ' polygons');
  } catch(e) {
    console.warn('  SDA iron oxide join failed (' + e.message + ') — file saved without iron_score');
  }
  save('soil_oahu.geojson', soils);

  // 9. Official Civil Defense Evacuation Zones — Oahu
  // ───────────────────────────────────────────────────
  // Source: Hawaii Emergency Management Agency (HI-EMA) / City and County of Honolulu
  //   via Hawaii Statewide GIS Program — Hazards/MapServer/2
  //   Updated April 2025. Multi-hazard zones used for tsunami, hurricane, and flood
  //   evacuation orders. Zone A = highest risk (lowest elevation, nearest hazard);
  //   zones B–F = progressively lower risk.
  //
  // Key fields:
  //   evac_zone  — zone designation (A, B, C, D, E, F)
  //   zone_type  — zone classification description
  //   zone_code  — numeric zone identifier
  //   island     — island name

  // 9. Elevation Range Zones — Oahu
  // ──────────────────────────────────
  // Source: Hawaii Statewide GIS Program — Elevation/MapServer/10
  // Polygon zones with lowelev / highelev fields (feet). Used for flood flow
  // analysis: high zones = rainfall source areas; low zones = accumulation zones.
  // maxAllowableOffset=0.001 (~111m) simplifies dense geometry for browser delivery.

  console.log('\n[9/10] Elevation range zones — Oahu');
  console.log('        Source: geodata.hawaii.gov — Elevation/MapServer/10\n');

  var elevZones = await arcgisQuery(
    'https://geodata.hawaii.gov/arcgis/rest/services/Elevation/MapServer/10',
    {
      geometry:           JSON.stringify(OAHU_BOX),
      geometryType:       'esriGeometryEnvelope',
      inSR:               '4326',
      spatialRel:         'esriSpatialRelIntersects',
      outFields:          'lowelev,highelev',
      maxAllowableOffset: '0.001',
    },
    'Elevation Zones'
  );
  save('elevation_zones_oahu.geojson', elevZones);

  console.log('\n[10/10] Civil defense evacuation zones — Oahu');
  console.log('       Source: geodata.hawaii.gov — Hazards/MapServer/2 (HI-EMA, April 2025)\n');

  var evacZones = await arcgisQuery(
    'https://geodata.hawaii.gov/arcgis/rest/services/Hazards/MapServer/11',
    {
      where:     "island = 'OAHU'",
      outFields: 'zone_type,zone_code,zone_desc,island',
    },
    'Evac Zones'
  );
  save('evac_zones_oahu.geojson', evacZones);

  console.log('\n─────────────────────────────────────────────────────────────────');
  console.log('Done!  10 datasets saved to data/geojson/');
  console.log('Reload the map in your browser — it will use the real data now.');
  console.log('─────────────────────────────────────────────────────────────────\n');
}

main().catch(function(err) {
  console.error('\nError: ' + err.message);
  console.error('\nTroubleshooting:');
  console.error('  • Node version?  node --version  (12+ required)');
  console.error('  • Internet OK?   curl "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer?f=json"');
  console.error('  • Behind a proxy? Set HTTPS_PROXY env var.');
  process.exit(1);
});
