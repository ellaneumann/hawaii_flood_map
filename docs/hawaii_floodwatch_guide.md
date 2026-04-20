# Hawaii FloodWatch — Annotated Guide & One-Minute Script

**Ka Moamoa Lab · April 2026**
**Project:** Hawaii FloodWatch interactive flood vulnerability map
**Live at:** `index.html` (open in browser; requires internet for tile layers)

---

## What This Tool Is

Hawaii FloodWatch is an interactive web map built to answer a question legislators, planners, and community advocates keep asking after the March 2026 Kona Low disasters:

> *Why does O'ahu flood where it does — and what would actually change that?*

The map combines official government data (FEMA, USGS, Census) with a 9-factor Flood Vulnerability Index (FVI) developed at Ka Moamoa Lab to show flood risk at a neighborhood scale. It is explicitly designed to make the case for Indigenous land restoration and natural interventions, not just gray infrastructure.

---

## The Four Tabs

### 1. Flood Index (default tab)

This is the core of the tool. It computes a flood vulnerability score for roughly **19,000 grid squares** across O'ahu (each square is about 400 meters across — roughly 4 city blocks).

**What the score means:**
| Score | Label | What it means |
|-------|-------|---------------|
| 0.00–0.30 | Low | Higher ground, fast-draining soils, far from streams |
| 0.30–0.45 | Moderate | Some risk factors; flooding possible in intense storms |
| 0.45–0.60 | High | Multiple compounding factors; appears regularly in NWS advisories |
| 0.60–0.75 | Very High | Documented flooding history; often former plantation land |
| 0.75–1.00 | Extreme | Flooded in March 2026 and sits inside evacuation zones |

**The 9 factors and their default weights:**

| Factor | Default Weight | What it measures |
|--------|---------------|-----------------|
| Stream proximity | 15% | Distance to nearest stream channel. Within 0.5 km = near 1.0. |
| Elevation | 15% | Low-lying areas accumulate water |
| Slope | 10% | Flat land where water pools instead of draining |
| Rainfall intensity | 15% | Windward vs. leeward; windward O'ahu receives 5–10× more rain |
| Impervious cover | 15% | Paved/developed land that can't absorb rain; water runs off immediately |
| Soil drainage | 10% | USDA soil hydrologic groups A–D; D (clay/compacted) = worst drainage |
| Iron oxide in soil | 10% | Pineapple plantation hardpan that blocks infiltration |
| March 2026 impact | 10% | Areas where flooding was actually documented in this event |
| Evacuation zone | 5% | Whether this area was under a civil-defense evacuation order |

**Why iron oxide matters for policy:** Former pineapple plantation soils (Waialua and Ala series) contain 18–28% iron oxide. Decades of heavy machinery created a hardpan layer just below the surface that blocks rainwater from soaking in. Rain instead moves sideways into streams 30–50% faster than in healthy soils. This is a **direct, measurable legacy of Dole and Del Monte operations** that ended decades ago but altered the land permanently — unless actively restored.

**Why the Wahiawa evacuation zone matters for policy:** The Wahiawa Dam was built in **1906 to supply water for sugar cane plantations**. Infrastructure designed for a plantation economy was not built to protect modern communities from climate-intensified storms. 5,500 people were evacuated in March 2026 because of a dam that is 120 years old.

**The sliders are interactive.** Users can increase or decrease the weight of any factor to see how the risk map changes. A researcher might weight iron oxide higher; a planner focused on sea level rise might weight elevation higher. The total must stay at 100%.

---

### Policy Scenarios: What If?

Six scenarios model different land-use or climate futures. Click one to see how the risk map shifts across all of O'ahu.

**Indigenous Land Restoration** *(the most directly actionable scenario for policymakers)*

Models what happens if:
- Iron-hardpan compaction from pineapple operations is reversed (−75% of iron oxide score)
- Soil drainage improves toward pre-disturbance levels through native plantings (−45% of soil score)
- Lo'i kalo (taro wetland fields) act as natural retention basins, buffering streams (−20% of stream proximity score)

This is based on measured runoff reductions at restored lo'i kalo sites in Hawaii. Lo'i kalo and ahupua'a watershed management were the dominant land-use system on O'ahu for over 1,000 years before plantation agriculture. The data shows what restoring them would mean for flood risk.

**Other scenarios:**
- **Native forest restoration** — Restoring forest in upper watersheds above 300 ft reduces runoff and improves infiltration
- **Urban expansion +20%** — Continued development in Ewa/Kapolei corridors increases downstream flood risk
- **Sea level rise +3.2 ft** — Raises groundwater and reduces coastal drainage; compounds existing risk
- **March 2026 repeat** — What if this extreme rainfall event happens again? (Climate science suggests it will, more frequently)

---

### 2. Layers Tab

Toggle individual data layers on and off. Key layers:

**Flood Vulnerability Heatmap** — the FVI score rendered as colored squares. Blue = low risk, amber = moderate, orange = high, magenta = very high, purple = extreme.

**FVI vs. FEMA discrepancy map** — Compares the 9-factor model against FEMA's official flood zones:
- **Magenta** = both the model and FEMA flag the area as high risk (strong agreement)
- **Purple** = FVI flags high risk but FEMA has no official zone (areas FEMA may be missing)
- **Blue** = FEMA has a flood zone but FVI scores lower (possibly over-designated)

The purple areas are the most policy-relevant: they represent communities facing real flood risk that FEMA's maps have not yet caught up with.

**March 2026 Event Layers** (all approximate, based on news reports and civil defense press releases):
- Flood impact zones — communities with documented flooding, rescues, or damage
- Evacuation zones (March 20–22) — areas under official civil-defense evacuation orders
- Wahiawa Dam risk site — the 120-year-old earthen dam that nearly failed
- Major rescue sites — mass rescue locations documented by Honolulu Fire Dept and National Guard
- Extreme rainfall areas — areas receiving >10 inches March 10–24

**Real Hydrology Data** (from USGS):
- Waterway network — 787 real stream flowlines from USGS NHD+ High Resolution
- FEMA Special Flood Hazard Areas — official DFIRM flood zones
- Watershed boundaries — USGS HUC-10 sub-watershed units for Hawaii

---

### 3. Event Tab

A timeline of the March 2026 Kona Low disasters:

| Date | Event |
|------|-------|
| March 10–16 | Storm 1: Hurricane-force winds, record rainfall. 135 mph gusts on Hawaii Island. 62" rain on Maui. |
| March 19–24 | Storm 2: Worst Hawaii flooding in 20 years. 236 rescued, 5,500 evacuated. Wahiawa Dam nearly failed. >$1B estimated damage. |
| March 23 | "Rain bomb" over Mānoa/Pālolo: 2–4" per hour for 3 hours. Mānoa Stream flooded an elementary school. |
| March cumulative | 2 trillion gallons total statewide. 3,000% of normal rainfall at some stations. |

**Why it was so bad:** Storm 2 hit soil already saturated from Storm 1 (immediate runoff from the first event). The Wahiawa Dam is 120 years old. North Shore drainage was not designed for this volume. The Molokai radar was offline during the event. Climate-intensified Kona low sequences are consistent with warming Pacific systems.

---

### 4. By Island Tab

Shows a summary card for each Hawaiian Island with its flood vulnerability status, population at risk, and key infrastructure concerns. Rendered from the `ISLANDS` data in `data.js`.

---

## Data Sources

| Dataset | Source | How it's used |
|---------|--------|---------------|
| Flood zones | FEMA NFHL (DFIRM) | Official Special Flood Hazard Areas layer |
| Stream network | USGS NHD+ High Resolution | 787 stream flowlines; stream proximity scoring |
| Watershed boundaries | USGS WBD HUC-10 | Sub-island watershed units |
| Community boundaries | US Census TIGER CDP | Neighborhood polygon shapes |
| Elevation | USGS national DEM (simplified) | Elevation and slope scoring |
| Soils | USDA SSURGO/NRCS | Hydrologic soil groups; drainage scoring |
| Rainfall | Hawaii Rainfall Atlas (UH) | Windward vs. leeward rainfall scoring |
| Land cover | NLCD | Impervious surface scoring |
| Iron oxide | Published soil surveys (Waialua/Ala series) | Pineapple plantation hardpan scoring |
| March 2026 event | NWS HFO, Hawaii Civil Defense, NPR, NASA | Impact zones, evacuation areas, rescue sites |

---

## Technical Notes (for developers)

- **`map.js`** — Leaflet map setup, layer groups, GeoJSON loading, waterway/FEMA/watershed layers, FVI vs. FEMA comparison layer, community boundary matching
- **`vulnerability.js`** — FVI computation (grid generation, factor scoring, weight normalization), scenario modeling, stats display
- **`ui.js`** — Tab switching, island card rendering, how-to modal
- **`styles.css`** — All visual styling; Ka Moamoa light-purple sidebar theme
- **`data.js`** — Island data, event data, zone definitions
- **`fetch_real_data.js`** — Node.js script to download real GeoJSON data from FEMA, USGS, and Census APIs. Run once with `node fetch_real_data.js`.

The FVI runs entirely in the browser — no server required. Grid cells are computed at ~400m resolution. Computation takes 2–5 seconds on first load.

---

## Limitations

This is a **screening-level planning tool**, not an official flood insurance rate map. It does not:
- Predict exact flood depths or extents
- Replace FEMA's official Flood Insurance Rate Maps (FIRMs) for legal/insurance purposes
- Account for real-time conditions (soil moisture, tide levels)
- Model storm surge from hurricanes

It is best used to:
- Understand *relative* flood risk across O'ahu neighborhoods
- Identify where land-use decisions and restoration efforts matter most
- Simulate how different policy choices would shift the risk distribution
- Support advocacy for research funding and Indigenous land restoration programs

---

## One-Minute Advocacy Script

*(For presenting to legislators, funders, or community groups)*

---

"This is Hawaii FloodWatch — a map built in the wake of the March 2026 Kona Low storms, the worst flooding Hawaii has seen in 20 years.

What you're seeing is a flood vulnerability score for every 400-meter square on O'ahu. The darker the color, the higher the flood risk. This isn't just FEMA's map — we're combining nine real factors: elevation, soil drainage, stream proximity, actual flooding from March 2026, and one factor that gets missed in official maps: iron oxide in the soil.

That iron oxide matters. Decades of Dole and Del Monte pineapple operations compacted O'ahu's Central Plain soils into a hardpan layer that blocks water from draining. Rain moves sideways into streams 30 to 50 percent faster than it would in healthy soil. The plantations are gone, but the soils remember.

Now watch what happens when I click this scenario: *Indigenous Land Restoration*. This models restoring lo'i kalo — taro wetland fields — and breaking up that hardpan through native planting. The risk map shifts. The purple and red areas shrink. This isn't speculation; it's based on measured runoff reductions at restored lo'i sites in Hawaii.

The Wahiawa Dam that nearly failed last March was built in 1906 to supply water for sugar cane. We are still living with the flood risk created by plantation infrastructure.

This tool exists to help answer the question: what investments would actually reduce flood risk on O'ahu? The data says Indigenous land restoration is one of the most effective answers we have."

---

*Total: approximately 55–65 seconds at conversational pace.*

---

## How to Run the Map

1. Open a terminal in the project folder
2. Run a local server: `python3 -m http.server 8000`
3. Open `http://localhost:8000` in a browser
4. (Optional) Run `node fetch_real_data.js` once to download real boundary shapes from USGS and Census

The map also works by opening `index.html` directly in most browsers (no server needed unless loading local GeoJSON files).
