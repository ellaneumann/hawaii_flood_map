# Hawaii FloodWatch — March 2026 Kona Low Event

A comprehensive interactive map documenting Hawaii's worst flooding in 20 years (March 2026). Built with Leaflet.js and modern web technologies.

## Overview

This project visualizes the catastrophic flooding event that struck Hawaii in March 2026, with satellite-based imagery, real-time weather data, news integration, and detailed impact documentation across all islands.

**Key Statistics:**
- **236 people rescued** from rooftops and flooded areas
- **5,500 residents evacuated** due to Wahiawa Dam failure risk
- **2 trillion gallons** of rainfall across the state (3,000% above normal)
- **$1 billion+** in estimated damage
- **115,000 customers** lost power on Oahu

## Project Structure

The project is now organized into modular, maintainable files:

```
hawaii_flood_map/
├── index.html          # Main HTML structure
├── styles.css          # All styling (~500 lines)
├── data.js             # All geographic and event data
├── map.js              # Leaflet map initialization and layers
├── ui.js               # UI interactions, news, weather fetching
├── README.md           # This file
└── index_old.html      # Backup of original monolithic file
```

## Files Explained

### index.html
The main HTML file that structures the page. Contains:
- Header with live weather and status indicators
- Sidebar with tabs for Layers, Event, Islands, News, and Data Sources
- Map area with controls and legend
- All external script references

### styles.css
Complete stylesheet (~600 lines) organized with clear sections:
- Layout (header, sidebar, main area, map)
- Component styles (cards, buttons, panels, popups)
- Responsive design and animations
- Custom scrollbars and Leaflet overrides

### data.js
All geographic and content data:
- `ISLANDS` — Island profiles with damage stats and recovery actions
- `STATIC_NEWS` — Archived news articles from the event
- `IMPACT_ZONES` — Flood impact areas with severity levels
- `EVAC_ZONES` — Evacuation orders and warnings (8 zones across Oahu, Maui, Kauai)
- `RESCUES` — Major rescue site locations
- `RAIN_AREAS` — Extreme rainfall zones
- `FEMA_AREAS` — Special Flood Hazard areas
- `SLR_AREAS` — Sea level rise 3.2ft scenarios
- `STREAMS` — Major waterways (color-coded)
- `WS_BOUNDS` — Watershed boundaries
- Color mappings for severity levels

### map.js
Leaflet map initialization and all geographic layers:
- Tile layer setup (Street and Satellite)
- Map initialization (starts with satellite view, zoom level 9)
- Layer groups and toggle logic
- All polygon/marker rendering for impact zones, evacuations, dams, rescues
- Rainfall areas, FEMA zones, streams, and watersheds
- Island markers with color-coded severity

### ui.js
User interface and interactions:
- **Island tab rendering** — Dynamic card generation from data
- **Tab navigation** — Switching between Layers, Event, Islands, News, Data
- **Sidebar toggle** — Collapsible sidebar with map resize
- **Weather fetching** — Live NWS Honolulu precipitation via API
- **News integration** — Fetch recent articles via Claude API + web search
- **News rendering** — Display both live and archived news articles
- **Event listeners** — Island selection, actions toggle, news expand/collapse

## Features

### Interactive Map
- **Satellite and Street views** — Toggle between base layers
- **Zoom controls** — Custom zoom in/out buttons
- **Layer toggles** — Enable/disable specific data layers:
  - Flood impact zones (color-coded by severity)
  - **Evacuation zones** — 8 detailed zones across islands:
    - North Shore Oahu (Wahiawa Dam failure risk, 5,500 evacuated)
    - West Oahu (downstream drainage overflow, 1,200 residents)
    - Mānoa/Pālolo (stream flooding, 800 residents)
    - Pearl Harbor/Aiea (floodplain risk, 2,100 residents)
    - Lahaina, Maui (retention basin overflow, 3,500 residents)
    - Kula/Upcountry Maui (hospital & infrastructure, 2,800 residents)
    - Wailua River Basin, Kauai (rapid rise, 1,200 residents)
    - Hanalei Area, Kauai (river system overflow, 600 residents)
  - Dam risk sites
  - Major rescue locations
  - Extreme rainfall areas
  - FEMA Special Flood Hazard areas
  - Sea level rise 3.2ft scenarios
  - Major streams and waterways
  - Watershed boundaries
- **Interactive popups** — Click any feature to see detailed information
- **Island markers** — Color-coded severity badges

### Sidebar Information
- **Event Tab** — Chronological timeline of the disaster with statistics
- **Islands Tab** — Per-island profiles with impact data and recovery actions
- **News Tab** — Live AI-powered news search + archived reports
- **Data Sources Tab** — Citation of all data sources used

### Live Data
- **NWS Weather** — Real-time precipitation from Honolulu station
- **AI News** — Recent Hawaii flood news via Claude API web search
- **Header Status** — Live system status (updated every 10 minutes)

## Data Sources

All data is sourced from official agencies and scientific organizations:

- **FEMA** — Digital Flood Insurance Rate Maps (DFIRM, Dec 2025)
- **NWS Honolulu (KHFO)** — Official rainfall summaries and alerts
- **University of Hawaii Mesonet** — 77-station precipitation network
- **NASA Earth Observatory** — Satellite imagery and disaster response
- **USGS National Map** — Elevation and hydrography data
- **Hawaii DLNR** — Watershed and stream network spatial data
- **Hawaii Emergency Management Agency** — Official situation reports

## Technologies

- **Leaflet.js** — Interactive mapping library
- **Cartography tiles** — OpenStreetMap Voyager (Street), Esri World Imagery (Satellite)
- **Claude API + Web Search** — AI-powered news aggregation
- **NWS API** — Live weather observations
- **IBM Plex fonts** — Typography (Sans + Monospace)

## Development

### Quick Start
1. Open `index.html` in a web browser
2. Map loads with satellite view zoomed to Hawaii at level 9
3. All layers are active by default (toggle in Layers tab)
4. Click any polygon or marker for details

### Adding New Data
Edit `data.js` to add:
- New impact zones: Add to `IMPACT_ZONES` array
- New streams: Add to `STREAMS` array
- New news articles: Add to `STATIC_NEWS` array
- New watersheds: Add to `WS_BOUNDS` array

### Modifying Styles
Edit `styles.css` with organized sections:
- Color scheme: CSS variables at `:root`
- Layout: `.main`, `.sidebar`, `.map-area`
- Components: `.card`, `.popup`, `.badge`, etc.

### Updating Map Layers
Edit `map.js`:
- Change initial zoom: Line ~18 (`zoom:9`)
- Change initial pan: Line ~18 (`center:[20.5,-157.5]`)
- Add new layer group: Add to `LG` object (lines ~26–34)
- Add new data rendering: Follow the pattern of existing layers (lines ~42+)

## Responsive Design & Mobile Support

The Hawaii FloodWatch map is fully responsive and optimized for all device types:

### Device Support
- **Desktop** (>1200px): Full sidebar, all controls visible, optimal layout
- **Tablet** (768–1200px): Sidebar collapses to 280px width, tou