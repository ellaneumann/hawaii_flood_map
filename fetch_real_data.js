#!/usr/bin/env node
/**
 * fetch_real_data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Downloads real geographic data from official public REST APIs and saves it
 * to data/geojson/ so the map can load it instead of the simplified placeholders.
 *
 * Run once:  node fetch_real_data.js
 * Requires:  Node.js 12+ (uses built-in https — no npm install needed)
 *
 * What it downloads:
 *   data/geojson/fema_areas.geojson       ← FEMA NFHL (official DFIRM flood zones)
 *   data/geojson/waterway_network.geojson  ← USGS NHD+ HR (real stream flowlines)
 *   data/geojson/watersheds.geojson        ← USGS WBD HUC-8 (watershed boundaries)
 *   data/geojson/hawaii_places.geojson     ← US Census TIGER (community/neighborhood boundaries)
 *
 * All three sources are official U.S. government data, public domain.
 */

const fs    = require('fs');
const https = require('https');
const path  = require('path');
const OUT   = path.join(__dirname, 'data', 'geojson');

// ── HTTP helper ────────────────────────────────────────────────────────────────

/** GET a URL, follow up to 3 redirects, return parsed JSON. */
function getJSON(url, redirects) {
  redirects = redirects === undefined ? 3 : redirects;
  return new Promise(function(resolve, reject) {
    https.get(url, { headers: { 'User-Agent': 'Hawaii-FloodWatch/1.0' } }, function(res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (redirects === 0) return reject(new Error('Too many redirects'));
        return resolve(getJSON(res.headers.location, redirects - 1));
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
    }).on('error', reject);
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
  // Hazard Areas (A* and V* zones) and excludes Zone X (low/minimal hazard),
  // which would otherwise cover most of Hawaii's interior.
  //
  // Key attributes returned:
  //   FLD_ZONE   — zone code: AE (detailed), AO (ponding), AH, VE (coastal), A
  //   ZONE_SUBTY — plain-language sub-type description
  //   STUDY_TYP  — 'DE' (detailed engineering) or 'A' (approximate)

  console.log('\n[1/3] FEMA Special Flood Hazard Areas');
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
      maxAllowableOffset: '0.0002',  // ~22m simplification — cuts file from 147 MB to ~3 MB
    },
    'FEMA SFHA'
  );
  save('fema_areas.geojson', fema);

  // 2. NHD+ HR Stream Flowlines — O'ahu
  // ─────────────────────────────────────
  // Source: USGS NHDPlus High Resolution
  //   https://hydro.nationalmap.gov/arcgis/rest/services/NHDPlus_HR/MapServer
  //
  // Layer 3 = NetworkNHDFlowline (stream centerlines with flow routing attributes).
  // ftype 460 = StreamRiver (natural watercourses).
  // ftype 558 = ArtificialPath (centerlines through lakes/reservoirs on the network).
  // streamorde >= 2 filters out tiny first-order headwater rills; keeps all
  // named streams and every stream that has at least one tributary flowing in.
  // Field name is lowercase: streamorde (not StreamOrde — NHD+ HR convention).
  //
  // Bounding box is O'ahu only because the FVI calculation runs on O'ahu.
  // To cover all islands, swap OAHU_BOX for HAWAII_ALL.

  console.log('\n[2/3] NHD+ HR stream flowlines (O\'ahu)');
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

  // 3. Watershed Boundary Dataset — HUC-8 sub-basins, Hawaii
  // ────────────────────────────────────────────────────────────
  // Source: USGS WBD (Watershed Boundary Dataset)
  //   https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer
  //
  // Layer 5 = WBDHU10 (watershed level, ~10–200 km² each).
  // Hawaii has 62 HUC-10 sub-watershed units — meaningful sub-island boundaries.
  // The HUC-8 layer (layer 4) only has one unit per island, which is too coarse.
  // Filter: states LIKE '%HI%' captures all Hawaiian Islands including NW chain.

  console.log('\n[3/3] Watershed boundaries (USGS WBD HUC-10) — Hawaii');
  console.log('       Source: hydro.nationalmap.gov — Watershed Boundary Dataset\n');

  var ws = await arcgisQuery(
    'https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/5',
    {
      where:              "states LIKE '%HI%'",
      outFields:          'name,huc10,areasqkm,states',
      maxAllowableOffset: '0.0005',  // ~55m — watershed outlines don't need high precision
    },
    'WBD HUC-10'
  );
  save('watersheds.geojson', ws);

  // 4. Census TIGER CDP Boundaries — Hawaii places
  // ────────────────────────────────────────────────
  // Source: US Census Bureau TIGER/Web (Census 2020)
  //   https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer
  //
  // Layer 16 = Places (CDPs and incorporated places).
  // STATE = '15' is Hawaii's FIPS code.
  //
  // Why we need this: the flood impact zones, evacuation areas, and rainfall
  // areas in data.js use simple rectangles. Real community boundaries from
  // the US Census give us accurate polygon shapes for places like Waialua,
  // Wahiawa, Manoa, Lahaina, etc. The map loads this file in loadRealLayers()
  // and replaces the rectangles with the official Census shapes.

  console.log('\n[4/4] Census TIGER community boundaries (Hawaii CDPs)');
  console.log('       Source: US Census Bureau TIGERweb — Census 2020 places\n');

  var places = await arcgisQuery(
    'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/16',
    {
      where:              "STATE='15'",
      outFields:          'NAME,GEOID,NAMELSAD',
      maxAllowableOffset: '0.0003',   // ~33m simplification — community outlines don't need survey precision
    },
    'Census Places'
  );
  save('hawaii_places.geojson', places);

  console.log('\n─────────────────────────────────────────────────────────────────');
  console.log('Done!  Real data saved to data/geojson/');
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
