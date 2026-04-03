/* ────────────────────────────────────────────────────────────────────────────────
   HAWAII FLOODWATCH — DATA
   Contains: islands, news, impact zones, evacuations, rescue sites, rainfall areas,
   FEMA zones, sea level rise areas, streams, and watersheds
   ──────────────────────────────────────────────────────────────────────────────── */

// ── ISLAND DATA ────────────────────────────────────────────────────────────────
var ISLANDS = [
  {
    name:'Oʻahu', lat:21.45, lng:-157.98, zoom:11,
    severity:'CRITICAL', color:'#E65100',
    maxRain:'12"', rescued:236, evacuated:5500, damage:'$800M+',
    desc:"North Shore communities Waialua and Haleiwa were catastrophically flooded March 19–20. Homes and cars were swept away. The 120-year-old Wahiawa Dam threatened failure, triggering 5,500 evacuations. 115,000 residents lost power. National Guard and Honolulu Fire Department conducted aerial rescues, including 72 children and adults airlifted from a youth camp on the west coast. The March 23 'rain bomb' over Mānoa and Pālolo valleys sent Mānoa Stream overflowing into shopping centers and an elementary school.",
    actions:[
      {t:'Do not return to flood-damaged homes without safety inspection', b:'Floodwater carries sewage, chemicals, and structural hazards. Wait for official clearance from Honolulu Civil Defense before re-entering flood-damaged properties.'},
      {t:'Register for disaster assistance at DisasterAssistance.gov', b:'FEMA disaster declarations unlock individual assistance grants for temporary housing, home repair, and personal property losses. Apply within 60 days of the disaster declaration.'},
      {t:'Document all damage with photos before cleanup', b:'Photograph every damaged room, item, and structural element. This record is required for FEMA claims, insurance claims, and SBA disaster loans.'},
      {t:'Report road damage and blocked drains to 311', b:'Call or text 311 to report clogged storm drains, road damage, or infrastructure failures in your area. This routes work orders to the City DPW and DWS.'},
      {t:'Check on neighbors — especially elderly and isolated residents', b:'The North Shore communities are tight-knit but some residents, particularly elderly individuals or those without transportation, may need help with cleanup, supplies, or evacuation from mud-damaged homes.'},
    ]
  },
  {
    name:'Maui', lat:20.80, lng:-156.33, zoom:11,
    severity:'SEVERE', color:'#D81B60',
    maxRain:'62"', rescued:0, evacuated:0, damage:'$100M+',
    desc:"The first Kona low dumped up to 62 inches of rain on Maui's West Maui Mountains — among the highest totals recorded anywhere in the state during this event. Lahaina, still recovering from the devastating 2023 wildfire, received an evacuation warning as retention basins neared capacity. Kula Hospital (in upcountry Maui) was damaged. Roads across the island were closed. Farmers reported millions in agricultural damage.",
    actions:[
      {t:"Lahaina residents: check the County of Maui's Kona Storm page", b:"Lahaina is still in long-term wildfire recovery. Floodwater mixed with fire debris is a compounding hazard. Visit mauicounty.gov for the latest information on road closures and assistance programs."},
      {t:'Upcountry residents: monitor stream gauges', b:'USGS maintains real-time stream gauges on Maui. Visit waterdata.usgs.gov and search for Maui stream stations to track water levels during subsequent rain events.'},
      {t:'Report agricultural damage to the Hawaii Department of Agriculture', b:'Farmers can report storm damage to HDOA for inclusion in federal agricultural disaster declarations. Call (808) 973-9600 or visit hdoa.hawaii.gov.'},
    ]
  },
  {
    name:'Kauaʻi', lat:22.06, lng:-159.50, zoom:11,
    severity:'MODERATE', color:'#F9A825',
    maxRain:'10"', rescued:0, evacuated:0, damage:'$20M+',
    desc:"The second Kona low began over south Kauai and the Kauai Channel before moving east toward Oahu. Kauai experienced flooding impacts primarily from the first storm system. The island's steep valleys and numerous streams create rapid runoff conditions even with moderate rainfall totals. South shore areas experienced flooding and road closures.",
    actions:[
      {t:"Monitor the Hanalei River and Waimea River USGS gauges", b:'Kauai streams rise quickly during rain. The USGS real-time gauge network at waterdata.usgs.gov provides flood stage data.'},
      {t:"Participate in Kauai's emergency planning", b:"Contact the Kauai Emergency Management Agency at kauai.gov/ema to learn about flood-prone areas in your community and sign up for Kauai Alert emergency notifications."},
    ]
  },
  {
    name:'Hawaiʻi Island', lat:19.59, lng:-155.43, zoom:9,
    severity:'MODERATE', color:'#F9A825',
    maxRain:'30"+', rescued:0, evacuated:0, damage:'$30M+',
    desc:"Intense thunderstorms containing rainfall rates of up to 4+ inches per hour struck Pahala through Hilo on March 23. Flooding impacts were mainly limited to road closures due to heavy ponding. Wind gusts reached 135.4 mph at higher elevations during the first Kona low — the highest recorded in the state during the event. Hilo rain gauge broke daily records.",
    actions:[
      {t:'Monitor Saddle Road and highway conditions during rain', b:"Highway 200 (Saddle Road) and saddle routes flood quickly during heavy rain. Check Hawaii DOT's highway conditions at hidot.hawaii.gov before traveling."},
      {t:'Lava field residents: understand your unique flood risk', b:"Parts of lower Puna have very low topographic relief and no natural drainage. Floodwater can pond rapidly with no outlet. Identify your flood zone at FEMA's Flood Map Service Center."},
    ]
  },
  {
    name:"Molokaʻi", lat:21.13, lng:-157.02, zoom:11,
    severity:'MONITORING', color:'#1565C0',
    maxRain:'22"', rescued:0, evacuated:0, damage:'Unknown',
    desc:"Molokai experienced significant rainfall during the event (Honolimaloo station recorded 22.31 inches). Critically, the Molokai WSR-88D weather radar was offline throughout the entire event, removing real-time precipitation data for forecasters covering both Molokai and Maui County. The University of Hawaii Mesonet stations helped fill this gap. Limited reporting on damages given the island's remote nature.",
    actions:[
      {t:"Advocate for radar restoration", b:"The Molokai radar outage was a critical gap. Contact your state legislators to urge prioritizing the restoration and modernization of the KHKI Molokai WSR-88D radar station."},
    ]
  },
  {
    name:"Lānaʻi", lat:20.83, lng:-156.92, zoom:11,
    severity:'MONITORING', color:'#1565C0',
    maxRain:'13"', rescued:0, evacuated:0, damage:'Minor',
    desc:"Lanai City recorded 13.37 inches during the event period. Road flooding and some agricultural damage reported. The island's small population and limited infrastructure meant fewer documented impacts compared to neighboring islands.",
    actions:[
      {t:"Check in with the Maui County Emergency Management Agency", b:"Lanai falls under Maui County jurisdiction. For assistance and information, contact Maui Emergency Management Agency at mauicounty.gov/669."},
    ]
  },
];

// ── STATIC NEWS ────────────────────────────────────────────────────────────────
var STATIC_NEWS = [
  {y:2026,title:"Back-to-back Kona lows deliver worst Hawaii flooding in 20 years",src:"NASA Earth Observatory",tag:"Event",tc:"#E65100",
   sum:"NASA satellite imagery captured brown floodwater pooling across Waialua and Mokuleia farmland on March 14, with sediment plumes spreading into Kaiaka Bay. NASA's Disasters Response Coordination System was activated.",
   full:"Back-to-back low-pressure systems struck Hawaii in March 2026, delivering some of the worst flooding the state has seen in decades. The kona lows siphoned moisture from the tropics, fueling slow-moving thunderstorms with torrential rains. The NWS reported rainfall totals of 5 to 10 inches throughout the state between March 11 and 15, with some areas seeing more than 30 inches. Weather stations in Honolulu, Hilo, Līhuʻe, and Kahului all broke daily rainfall records. Preliminary assessments indicate that hundreds of homes on Oʻahu sustained damage. The storm produced widespread wind gusts between 60 and 75 mph, with gusts in some places reaching 100 mph. As many as 115,000 Oʻahu residents faced power outages.",
   url:"https://science.nasa.gov/earth/earth-observatory/kona-storms-flood-oahu/"},
  {y:2026,title:"236 rescued, 5,500 evacuated as Oahu flooding threatens 120-year-old dam",src:"NPR / OPB",tag:"Rescue",tc:"#D81B60",
   sum:"Hawaii's worst flooding in 20 years prompted Gov. Josh Green to declare a disaster. Crews rescued 236 people from rooftops and a flooded youth camp. The 1906-built Wahiawa dam threatened to fail.",
   full:"Hawaii officials urged people in hard-hit areas to evacuate after heavy rains fell on already-saturated soil. Muddy floodwaters smothered vast stretches of Oahu's North Shore. Raging waters lifted homes and cars and prompted evacuation orders for 5,500 people north of Honolulu. Officials cautioned that the 120-year-old Wahiawa Dam could fail. On Maui, authorities upgraded an evacuation advisory for parts of Lahaina, still recovering from the 2023 wildfire. Gov. Green said the flooding was the state's most serious since 2004. The storm's cost could top $1 billion.",
   url:"https://www.npr.org/2026/03/20/nx-s1-5755105/hawaii-evacuations-flooding-dam-failure"},
  {y:2026,title:"2 trillion gallons fell on Hawaii in March — 3,000% above normal",src:"University of Hawaii / Phys.org",tag:"Science",tc:"#7B2D8B",
   sum:"UH Mānoa's Hawaii Mesonet documented more than 2 trillion gallons of rain statewide — enough to fill 3 million Olympic-sized swimming pools. Some areas recorded 14-day totals at 3,000% of normal.",
   full:"More than 2 trillion gallons of water inundated Hawaiʻi in March 2026. The statewide average rainfall between March 1–23 was 18.25 inches — 2.6 times the March average of 6.85 inches. The Hawaii Mesonet's 77-station network proved critical, especially after the Molokai radar went offline. The first storm brought hurricane-force wind gusts of 135.4 mph to Hawaii Island and up to 62 inches of rain to Maui. The second Kona storm triggered the 'rain bomb' over Mānoa/Pālolo — 2 to 4 inches per hour, with 3.5–6.5 inches total at six stations in a three-hour window.",
   url:"https://phys.org/news/2026-04-trillion-gallons-trigger-historic-hawaii.html"},
  {y:2026,title:"Molokai radar was offline during the entire Kona low flooding event",src:"Hawaii News Now",tag:"Infrastructure",tc:"#005F73",
   sum:"The KHKI Molokai WSR-88D radar was out of service during both Kona low events, cutting off a crucial data source for forecasters covering Oahu and Maui County.",
   full:"Forecasters faced an added challenge during the March 2026 flooding: the Molokai radar was out of service, cutting off a crucial data source as flooding continued. The Molokai radar is critical for monitoring storms approaching Oahu from the west and southwest. The Hawaii Mesonet helped fill that gap by tracking rainfall with measurements recorded every five minutes, but the radar outage limited the advance warning forecasters could provide. Officials and lawmakers have since called for prioritizing the restoration of the Molokai NEXRAD station.",
   url:"https://www.hawaiinewsnow.com/2026/04/01/new-data-shows-march-storms-dumped-over-2-trillion-gallons-rain-over-hawaii/"},
  {y:2026,title:"Lahaina receives evacuation warning as retention basins near capacity",src:"CNN / OPB",tag:"Evacuation",tc:"#D81B60",
   sum:"Lahaina — still recovering from the August 2023 wildfire — received an evacuation warning during the second Kona low as retention basins reached capacity. Kula Hospital on Maui was also damaged.",
   full:"On the island of Maui, authorities upgraded an evacuation advisory to a warning for some parts of Lahaina, which is still reeling from the deadly 2023 wildfire, because of retention basins nearing capacity. The disaster compounded the ongoing trauma for a community already in a multi-year recovery process. Kula Hospital in upcountry Maui was also damaged by the storms. Agricultural losses across Maui were in the millions of dollars. Gov. Green said federal support was assured after his chief of staff spoke to the White House.",
   url:"https://www.cnn.com/2026/03/20/weather/hawaii-flooding-oahu-climate"},
];

// ── IMPACT ZONES (documented flood areas) ─────────────────────────────────────
var IMPACT_ZONES = [
  {name:"Waialua / Haleiwa — Oahu North Shore",coords:[[21.57,-158.10],[21.61,-158.10],[21.61,-158.03],[21.57,-158.03]],
   rain:"8–12\"",rescued:150,desc:"Worst-hit area. Homes and cars swept away by Kaukonahua Stream overflow. Communities completely inundated.",severity:"critical"},
  {name:"Wahiawa / Central Oahu",coords:[[21.48,-158.04],[21.53,-158.04],[21.53,-157.98],[21.48,-157.98]],
   rain:"8–10\"",rescued:0,desc:"Dam area. 5,500 residents evacuated north of this area due to Wahiawa Dam failure risk.",severity:"critical"},
  {name:"Pupukea / North Shore Oahu",coords:[[21.64,-158.06],[21.67,-158.06],[21.67,-158.01],[21.64,-158.01]],
   rain:"10–12\"",rescued:30,desc:"Vehicle documented completely submerged in Pupukea. Multiple structure rescues.",severity:"high"},
  {name:"Mānoa / Pālolo — Honolulu",coords:[[21.29,-157.82],[21.32,-157.82],[21.32,-157.78],[21.29,-157.78]],
   rain:"3.5–6.5\"(3hrs)",rescued:0,desc:"March 23 'rain bomb' — stationary storm cell dropped 2–4 inches per hour. Mānoa Stream overflowed into parking lots, roads, and Mānoa Elementary School.",severity:"high"},
  {name:"Waianae / West Oahu",coords:[[21.43,-158.22],[21.48,-158.22],[21.48,-158.15],[21.43,-158.15]],
   rain:"5\"",rescued:72,desc:"72 children and adults airlifted by National Guard from Our Lady of Keaau youth retreat camp on the west coast.",severity:"high"},
  {name:"Lahaina — West Maui",coords:[[20.86,-156.70],[20.91,-156.70],[20.91,-156.63],[20.86,-156.63]],
   rain:"15+\"",rescued:0,desc:"Evacuation warning issued. Retention basins neared capacity. Still in wildfire recovery from August 2023 disaster.",severity:"high"},
  {name:"West Maui Mountains",coords:[[20.87,-156.66],[20.95,-156.66],[20.95,-156.57],[20.87,-156.57]],
   rain:"62\"",rescued:0,desc:"Highest recorded rainfall in the state during the event. Puu Kukui station (USGS) recorded 19.61 inches in Storm 2 alone.",severity:"high"},
  {name:"Kula / Upcountry Maui",coords:[[20.74,-156.38],[20.80,-156.38],[20.80,-156.30],[20.74,-156.30]],
   rain:"10–18\"",rescued:0,desc:"Kula Hospital damaged. Road closures throughout upcountry Maui. Agricultural losses in millions.",severity:"moderate"},
  {name:"Pahala — Big Island South",coords:[[19.16,-155.58],[19.21,-155.58],[19.21,-155.48],[19.16,-155.48]],
   rain:"20+\"",rescued:0,desc:"March 23 thunderstorms with 4+ inch/hour rainfall rates. Road closures due to heavy ponding.",severity:"moderate"},
  {name:"Hilo — Big Island East",coords:[[19.69,-155.10],[19.74,-155.10],[19.74,-155.02],[19.69,-155.02]],
   rain:"15+\"",rescued:0,desc:"Daily rainfall records broken. Hilo is the wettest city in the US — even so this event was exceptional.",severity:"moderate"},
  {name:"South Kauai / Kauai Channel",coords:[[21.84,-159.55],[21.91,-159.55],[21.91,-159.43],[21.84,-159.43]],
   rain:"10+\"",rescued:0,desc:"Storm 2 originated over south Kauai before tracking east toward Oahu. Flooding and road closures.",severity:"moderate"},
  {name:"Honolimaloo — Molokai",coords:[[21.18,-156.96],[21.22,-156.96],[21.22,-156.89],[21.18,-156.89]],
   rain:"22.31\"",rescued:0,desc:"Highest rainfall on Molokai (UH Mesonet). Molokai radar was offline throughout the event.",severity:"moderate"},
];

// ── EVACUATION ZONES ──────────────────────────────────────────────────────────
var EVAC_ZONES = [
  {name:"North Shore Oahu Evacuation (Dam Failure Risk)",
   coords:[[21.55,-158.15],[21.58,-158.17],[21.62,-158.16],[21.67,-158.14],[21.68,-158.10],[21.66,-158.04],[21.63,-158.02],[21.59,-158.03],[21.56,-158.05],[21.54,-158.08],[21.53,-158.12],[21.55,-158.15]],
   reason:"Wahiawa Dam failure risk", residents:5500, source:"Hawaii Civil Defense",
   desc:"5,500 residents evacuated from Waialua, Maunawili, Heʻeia, and surrounding areas due to Wahiawa Dam (1906, earthen, height 47 ft) failure risk. Zone includes North Shore communities downstream of the dam. Evacuation lifted by March 22 as water levels stabilized. Evacuation route: HI-803 (Whitmore Ave) north to HI-99 (Kamehameha Hwy)."},
  {name:"West Oahu Evacuation (Downstream Risk)",
   coords:[[21.55,-158.25],[21.60,-158.28],[21.65,-158.26],[21.68,-158.22],[21.68,-158.15],[21.64,-158.12],[21.60,-158.10],[21.56,-158.12],[21.53,-158.16],[21.52,-158.22],[21.55,-158.25]],
   reason:"Kaukonahua/Wahiawa drainage overflow", residents:1200, source:"Honolulu Civil Defense",
   desc:"Residents in Waialua, Mokuleia, and lower Haleʻiwa warned due to Kaukonahua Stream and Wahiawa Stream drainage overflow. Includes agricultural areas and scattered residential. Route via Main Road (HI-803) to HI-99 north."},
  {name:"Manoa/Palolo Evacuation (Stream Flooding)",
   coords:[[21.30,-157.82],[21.33,-157.84],[21.35,-157.82],[21.34,-157.78],[21.31,-157.76],[21.29,-157.78],[21.30,-157.82]],
   reason:"Manoa & Palolo Stream overflow", residents:800, source:"Honolulu Emergency Services",
   desc:"Mānoa and Pālolo valley residents evacuated due to stream overflow on March 23. The 'rain bomb' caused Mānoa Stream to overtop, affecting shopping centers, residences, and Mānoa Elementary. Route via Kaimukī Ave to Highway 1."},
  {name:"Pearl Harbor Area (Aiea Bridge Risk)",
   coords:[[21.37,-157.99],[21.41,-158.01],[21.43,-157.97],[21.40,-157.93],[21.37,-157.94],[21.37,-157.99]],
   reason:"Flood plain and industrial facility risk", residents:2100, source:"FEMA/State Civil Defense",
   desc:"Pearl Harbor area residents and workers warned due to Aiea Stream flooding and adjacent floodplain. Includes residences in Aiea, Pearl City, and industrial zones. Route via HI-63 (Kamehameha Hwy) to central Oahu."},
  {name:"Lahaina Evacuation Warning (Maui)",
   coords:[[20.84,-156.74],[20.88,-156.76],[20.92,-156.74],[20.91,-156.69],[20.87,-156.68],[20.84,-156.69],[20.84,-156.74]],
   reason:"Retention basin overflow & post-fire vulnerability", residents:3500, source:"Maui County Emergency Mgmt",
   desc:"Lahaina residents upgraded to evacuation warning on March 20 as retention basins from 2023 wildfire recovery neared capacity. Compounding hazard: floodwater mixed with fire debris. Evacuation route via HI-30 (Mokulele Hwy) south or north to upcountry Maui."},
  {name:"Kula/Upcountry Maui (Hospitals & High Ground)",
   coords:[[20.79,-156.35],[20.85,-156.38],[20.90,-156.38],[20.92,-156.33],[20.88,-156.28],[20.82,-156.30],[20.79,-156.35]],
   reason:"Kula Hospital & water systems damage", residents:2800, source:"Maui County",
   desc:"Upcountry residents sheltered in place with advisories. Kula Hospital damaged. Stream flooding in agricultural zones. Higher elevation provides natural refuge but vulnerable infrastructure. No major evacuation but road closures via HI-37."},
  {name:"Wailua River Basin Evacuation (Kauai)",
   coords:[[22.02,-159.35],[22.08,-159.38],[22.12,-159.36],[22.10,-159.30],[22.05,-159.27],[22.02,-159.35]],
   reason:"Rapid river rise and floodplain overflow", residents:1200, source:"Kauai County Civil Defense",
   desc:"Wailua River residents (south bank near Wailua Homesteads) evacuated due to rapid water rise and historical flood patterns. Wailua Stream also elevated. Route via HI-56 (Kuhio Hwy) north."},
  {name:"Hanalei Area Evacuation (North Shore Kauai)",
   coords:[[22.17,-159.58],[22.22,-159.61],[22.24,-159.57],[22.21,-159.52],[22.17,-159.55],[22.17,-159.58]],
   reason:"Hanalei River & stream system overflow", residents:600, source:"Kauai County",
   desc:"Hanalei Valley residents and businesses warned. Hanalei River one of Kauai's largest, prone to rapid rises. Includes Hanalei Beach Park and Hanalei Bay area. North Shore known for hydrophobic lava fields limiting drainage."},
];

// ── RESCUE SITES ──────────────────────────────────────────────────────────────
var RESCUES=[
  {lat:21.655,lng:-158.022,name:"Our Lady of Keaau Youth Camp",n:72,desc:"National Guard and Honolulu Fire airlifted 72 children and adults from this spring break camp on Oahu's west coast."},
  {lat:21.575,lng:-158.062,name:"Waialua / Haleiwa Mass Rescue",n:150,desc:"Over 150 people rescued from rooftops and flooded homes as Kaukonahua Stream overflowed. Some pulled directly from rooftops."},
  {lat:21.643,lng:-158.044,name:"North Shore Campsite",n:70,desc:"A group of 70 people were surrounded by water at a campsite. Gov. Green: 'They were having difficulty getting out because there was so much water around them.'"},
];

// ── EXTREME RAINFALL AREAS ─────────────────────────────────────────────────────
var RAIN_AREAS=[
  {name:"Oahu North Shore (Storm 2 peak)",coords:[[21.55,-158.18],[21.70,-158.18],[21.70,-157.98],[21.55,-157.98]],rain:"8–12\""},
  {name:"West Maui Mountains (Storm 1 peak — 62\" total)",coords:[[20.83,-156.72],[20.98,-156.72],[20.98,-156.54],[20.83,-156.54]],rain:"19–62\""},
  {name:"Molokai (all stations)",coords:[[21.10,-157.20],[21.25,-157.20],[21.25,-156.75],[21.10,-156.75]],rain:"9–22\""},
  {name:"Lanai",coords:[[20.78,-157.00],[20.94,-157.00],[20.94,-156.80],[20.78,-156.80]],rain:"7–13\""},
  {name:"Hilo / Pahala Big Island",coords:[[19.10,-155.62],[19.80,-155.62],[19.80,-154.95],[19.10,-154.95]],rain:"15–30\""},
  {name:"Kauai South / Kauai Channel",coords:[[21.83,-159.65],[21.95,-159.65],[21.95,-159.30],[21.83,-159.30]],rain:"10+\""},
];

// ── FEMA SPECIAL FLOOD HAZARD ─────────────────────────────────────────────────
var FEMA_AREAS=[
  {name:"FEMA SFHA - Kaukonahua Stream Floodplain (Waialua/Haleiwa)",coords:[[21.56,-158.10],[21.60,-158.10],[21.60,-158.04],[21.56,-158.04]]},
  {name:"FEMA SFHA - Honolulu (Nuuanu, Palolo, Manoa Streams)",coords:[[21.28,-157.84],[21.32,-157.84],[21.32,-157.78],[21.28,-157.78]]},
  {name:"FEMA SFHA - Pearl Harbor / Aiea",coords:[[21.37,-157.99],[21.41,-157.99],[21.41,-157.93],[21.37,-157.93]]},
  {name:"FEMA SFHA - Lahaina / Kaanapali Coastal Zone",coords:[[20.86,-156.71],[20.92,-156.71],[20.92,-156.64],[20.86,-156.64]]},
  {name:"FEMA SFHA - Hana Highway Streams",coords:[[20.75,-156.02],[20.83,-156.02],[20.83,-155.95],[20.75,-155.95]]},
  {name:"FEMA SFHA - Wailua River Basin",coords:[[22.03,-159.36],[22.09,-159.36],[22.09,-159.27],[22.03,-159.27]]},
  {name:"FEMA SFHA - Hanalei River / North Shore Kauai",coords:[[22.18,-159.56],[22.22,-159.56],[22.22,-159.47],[22.18,-159.47]]},
  {name:"FEMA SFHA - Hilo Bayfront / Wailuku River",coords:[[19.71,-155.09],[19.75,-155.09],[19.75,-155.02],[19.71,-155.02]]},
];

// ── SLR COASTAL FLOOD (3.2 ft scenario) ───────────────────────────────────────
var SLR_AREAS=[
  {name:"SLR 3.2ft Coastal Flood — Honolulu Waterfront",coords:[[21.29,-157.88],[21.31,-157.88],[21.31,-157.83],[21.29,-157.83]]},
  {name:"SLR 3.2ft Coastal Flood — Waikiki",coords:[[21.27,-157.84],[21.29,-157.84],[21.29,-157.81],[21.27,-157.81]]},
  {name:"SLR 3.2ft Coastal Flood — Kaneohe Bay",coords:[[21.41,-157.82],[21.44,-157.82],[21.44,-157.78],[21.41,-157.78]]},
  {name:"SLR 3.2ft Coastal Flood — Kailua Beach / Oahu East",coords:[[21.38,-157.74],[21.41,-157.74],[21.41,-157.70],[21.38,-157.70]]},
  {name:"SLR 3.2ft Coastal Flood — Kahului Harbor, Maui",coords:[[20.89,-156.48],[20.92,-156.48],[20.92,-156.44],[20.89,-156.44]]},
  {name:"SLR 3.2ft Coastal Flood — Lihue / Nawiliwili, Kauai",coords:[[21.95,-159.36],[21.98,-159.36],[21.98,-159.31],[21.95,-159.31]]},
];

// ── MAJOR STREAMS ─────────────────────────────────────────────────────────────
var STREAMS=[
  {name:"Kaukonahua Stream (FLOODED — swept away homes)",c:'#E65100',w:3,pts:[[21.57,-158.09],[21.585,-158.07],[21.60,-158.05],[21.615,-158.04]]},
  {name:"Mānoa Stream (FLOODED — rain bomb overflow)",c:'#D81B60',w:3,pts:[[21.333,-157.812],[21.318,-157.815],[21.305,-157.819],[21.295,-157.825]]},
  {name:"Palolo Stream",c:'#1E88E5',w:2,pts:[[21.318,-157.795],[21.308,-157.800],[21.298,-157.808]]},
  {name:"Waimea River — Kauai",c:'#1E88E5',w:2.5,pts:[[22.065,-159.67],[22.055,-159.645],[22.048,-159.623],[22.04,-159.605]]},
  {name:"Wailua River — Kauai",c:'#1E88E5',w:2.5,pts:[[22.08,-159.40],[22.065,-159.37],[22.048,-159.345],[22.038,-159.33]]},
  {name:"Hanalei River — Kauai North",c:'#1E88E5',w:2,pts:[[22.205,-159.53],[22.21,-159.515],[22.212,-159.50],[22.210,-159.484]]},
  {name:"Wailuku River — Hilo",c:'#1E88E5',w:2.5,pts:[[19.742,-155.115],[19.730,-155.100],[19.718,-155.085],[19.710,-155.07]]},
  {name:"Kaukonahua — N Branch",c:'#1E88E5',w:1.5,pts:[[21.63,-158.10],[21.61,-158.09],[21.59,-158.08]]},
  {name:"Nuuanu Stream",c:'#1E88E5',w:2,pts:[[21.335,-157.850],[21.32,-157.845],[21.31,-157.840]]},
];

// ── WATERSHED BOUNDARIES ──────────────────────────────────────────────────────
var WS_BOUNDS=[
  {name:"Kaukonahua Watershed — Oahu",coords:[[21.50,-158.14],[21.68,-158.14],[21.68,-157.96],[21.50,-157.96]]},
  {name:"Mānoa-Pālolo Watershed — Honolulu",coords:[[21.27,-157.86],[21.35,-157.86],[21.35,-157.77],[21.27,-157.77]]},
  {name:"Wailua Watershed — Kauai",coords:[[22.01,-159.42],[22.12,-159.42],[22.12,-159.25],[22.01,-159.25]]},
  {name:"Wailuku Watershed — Hilo, Big Island",coords:[[19.68,-155.18],[19.81,-155.18],[19.81,-155.02],[19.68,-155.02]]},
];

// ── CONTAMINATION SOURCES (Potential water quality impacts from flooding) ────
// These represent areas where flood inundation could mobilize contaminants
var CONTAMINATION_SOURCES = {
  // Onsite sewage disposal systems (OSDS) — source: Hawaii Department of Health
  // When inundated, septic systems can discharge raw sewage into flood waters
  septic_oahu: [
    {name:"Waialua/Haleiwa OSDS High-Density Zone",coords:[[21.54,-158.13],[21.62,-158.13],[21.62,-157.99],[21.54,-157.99]],type:"septic",density:"high",systems:850,risk:"CRITICAL",desc:"Heavily impacted by March flooding. High concentration of onsite sewage disposal systems in flood zone. Flood damage +350 documented backups."},
    {name:"Mānoa Valley OSDS Areas",coords:[[21.28,-157.85],[21.33,-157.85],[21.33,-157.78],[21.28,-157.78]],type:"septic",density:"moderate",systems:120,risk:"HIGH",desc:"Upslope OSDS systems leached septic effluent into Mānoa Stream during rain bomb event."},
    {name:"Waianae Coastal OSDS Zone",coords:[[21.42,-158.24],[21.50,-158.24],[21.50,-158.14],[21.42,-158.14]],type:"septic",density:"moderate",systems:280,risk:"HIGH",desc:"Systems vulnerable to beach/valley flood convergence."},
  ],
  septic_maui: [
    {name:"Lahaina/Kaanapali OSDS Zone",coords:[[20.84,-156.72],[20.93,-156.72],[20.93,-156.62],[20.84,-156.62]],type:"septic",density:"high",systems:420,risk:"HIGH",desc:"Compounded hazard: post-wildfire debris + septic system inundation risk."},
    {name:"Kula Upcountry OSDS",coords:[[20.72,-156.40],[20.82,-156.40],[20.82,-156.28],[20.72,-156.28]],type:"septic",density:"moderate",systems:90,risk:"MODERATE",desc:"High elevation; moderate flood risk but drainage to communities below."},
  ],
  septic_kauai: [
    {name:"Wailua/Kapa'a OSDS High-Density",coords:[[22.04,-159.36],[22.10,-159.36],[22.10,-159.27],[22.04,-159.27]],type:"septic",density:"high",systems:340,risk:"HIGH",desc:"Wailua River flood zone with high septic density."},
  ],

  // Solid waste facilities and landfills
  landfills: [
    {name:"Waialua Sanitary Landfill (CLOSED)",coords:[[21.54,-158.17],[21.56,-158.17],[21.56,-158.15],[21.54,-158.15]],type:"landfill",status:"closed",risk:"MODERATE",desc:"Historic landfill. March 2026 flooding created ponding over landfill cap. Potential for leachate mobilization. Located in active flood zone."},
    {name:"Central District Waste Management (Oahu)",coords:[[21.39,-157.96],[21.41,-157.96],[21.41,-157.94],[21.39,-157.94]],type:"solid_waste",status:"active",risk:"HIGH",desc:"Major waste transfer facility. Flood exposure could impact operations and release waste streams."},
    {name:"Kauhikoa Sanitary Landfill (Maui)",coords:[[20.80,-156.47],[20.83,-156.47],[20.83,-156.44],[20.80,-156.44]],type:"landfill",status:"active",risk:"MODERATE",desc:"Maui's primary landfill. Located 12 miles south of high-rainfall zones but storm surge/drainage risk."},
    {name:"H-Power Waste-to-Energy (Campbell Industrial Park)",coords:[[21.42,-158.04],[21.44,-158.04],[21.44,-158.02],[21.42,-158.02]],type:"industrial_waste",status:"active",risk:"MODERATE",desc:"Waste thermal conversion facility. Flood risk to auxiliary systems and waste processing."},
  ],

  // Industrial facilities (potential chemical/hazmat release zones)
  industrial: [
    {name:"Campbell Industrial Complex",coords:[[21.40,-158.10],[21.45,-158.10],[21.45,-157.98],[21.40,-157.98]],type:"industrial",risk:"HIGH",desc:"Multiple industrial tenants including chemicals, fuel storage. March flooding reached perimeter."},
    {name:"Honolulu International Airport Fuel Farm",coords:[[21.32,-157.93],[21.34,-157.93],[21.34,-157.91],[21.32,-157.91]],type:"fuel_storage",risk:"MODERATE",desc:"JET-A and aviation fuel storage. Surrounded by retention ponds; flooding could overwhelm containment."},
    {name:"Sand Island Waste & Recycling Complex",coords:[[21.35,-157.88],[21.37,-157.88],[21.37,-157.86],[21.35,-157.86]],type:"waste_recycling",risk:"MODERATE",desc:"Scrap metal, glass, organic waste. March flooding caused temporary facility closure."},
  ],

  // Agricultural runoff zones (pesticide, fertilizer, animal waste)
  agricultural: [
    {name:"Central Oahu Agricultural Region (Waialua/Schofield)",coords:[[21.50,-158.12],[21.60,-158.12],[21.60,-157.92],[21.50,-157.92]],type:"agricultural",area_acres:8400,primary:"flowers,pineapple history",risk:"HIGH",desc:"Historic plantation lands with residual soil contamination. Active flower nurseries use pesticides. Runoff enters Kaukonahua Stream. March floods mobilized topsoil and applied chemicals downstream."},
    {name:"Lahaina Valley Agricultural Area",coords:[[20.82,-156.70],[20.95,-156.70],[20.95,-156.55],[20.82,-156.55]],type:"agricultural",area_acres:2100,primary:"seed crops,cattle",risk:"MODERATE",desc:"Seed corn and cattle operations. Flood runoff carries both agrochemicals and livestock waste."},
    {name:"Wailua Valley Agricultural (Kauai)",coords:[[22.02,-159.38],[22.12,-159.38],[22.12,-159.28],[22.02,-159.28]],type:"agricultural",area_acres:1800,primary:"taro,local farms",risk:"MODERATE",desc:"Taro ponds and local produce farms. Traditional agricultural runoff enters Wailua River."},
  ],

  // Underground storage tanks (historical and active)
  ust: [
    {name:"Waialua Former Military Facility UST Zone",coords:[[21.55,-158.12],[21.60,-158.12],[21.60,-158.07],[21.55,-158.07]],type:"ust",count:12,active:2,risk:"MODERATE",desc:"Historical military base with documented underground storage tanks (USTs). 10 removed; 2 remain active. March flooding created hydraulic pressure on tank integrity."},
    {name:"Honolulu Airport UST Complex",coords:[[21.31,-157.94],[21.35,-157.94],[21.35,-157.90],[21.31,-157.90]],type:"ust",count:8,active:4,risk:"MODERATE",desc:"Fuel and additive storage tanks. Flood control systems kept main facilities dry, but nearby stormwater contamination possible."},
  ]
};

// ── ELEVATION ZONES (for flood flow analysis) ──────────────────────────────────
// Higher elevations = source areas; low-lying areas = accumulation zones
var ELEVATION_ZONES = [
  {name:"High Elevation Rainfall Zones (>3000 ft)",type:"source",coords:[[20.70,-156.68],[21.00,-156.68],[21.00,-156.44],[20.70,-156.44]],elev_min:3000,elev_max:6000,color:"#1a237e",desc:"West Maui & upcountry areas receiving heaviest rainfall. Steep slopes accelerate runoff."},
  {name:"Mid-Elevation Transition Zones (1000-3000 ft)",type:"transition",coords:[[21.45,-158.10],[21.65,-158.10],[21.65,-157.95],[21.45,-157.95]],elev_min:1000,elev_max:3000,color:"#3f51b5",desc:"Rapid flow acceleration zone. Runoff from high elevations concentrates here into stream channels."},
  {name:"Low-Lying Accumulation (0-300 ft)",type:"sink",coords:[[21.50,-158.20],[21.70,-158.20],[21.70,-157.95],[21.50,-157.95]],elev_min:0,elev_max:300,color:"#bbdefb",desc:"Valley floors and coastal plains where floodwater accumulates. Slowest drainage."},
];

// ── HIGH-QUALITY WATERWAY NETWORK ──────────────────────────────────────────────
// More detailed stream & river channels with flow direction indicators
var WATERWAY_NETWORK = [
  // Oahu - North Shore (Kaukonahua drainage)
  {name:"Kaukonahua Stream - Upper",type:"stream",width:2,color:"#0277bd",flow:"S",pts:[[21.62,-158.08],[21.60,-158.07],[21.58,-158.06],[21.57,-158.04]]},
  {name:"Kaukonahua Stream - Middle",type:"stream",width:3,color:"#01579b",flow:"SE",pts:[[21.57,-158.04],[21.555,-158.035],[21.54,-158.02],[21.525,-158.00]]},
  {name:"Kaukonahua Stream - Lower (MAIN FLOOD CHANNEL)",type:"stream",width:4,color:"#e65100",flow:"SE",pts:[[21.525,-158.00],[21.51,-157.98],[21.495,-157.96],[21.475,-157.94]],flood_severity:"critical"},
  {name:"Heeia Stream (tributary)",type:"tributary",width:1.5,color:"#0277bd",flow:"N",pts:[[21.54,-158.07],[21.555,-158.055],[21.565,-158.04]]},

  // Oahu - Central Honolulu (Manoa drainage)
  {name:"Mānoa Stream - Upper Valley",type:"stream",width:1.5,color:"#0277bd",flow:"S",pts:[[21.345,-157.825],[21.338,-157.820],[21.330,-157.815]]},
  {name:"Mānoa Stream - Main (RAIN BOMB OVERFLOW POINT)",type:"stream",width:2.5,color:"#d81b60",flow:"S",pts:[[21.330,-157.815],[21.322,-157.810],[21.315,-157.805],[21.305,-157.800]],flood_severity:"high"},
  {name:"Pālolo Stream",type:"tributary",width:1,color:"#0277bd",flow:"SE",pts:[[21.320,-157.800],[21.310,-157.800],[21.300,-157.805]]},

  // Oahu - Windward side
  {name:"Wailua River (Kailua)",type:"river",width:2,color:"#0277bd",flow:"S",pts:[[21.42,-157.75],[21.40,-157.74],[21.37,-157.73]]},
  {name:"Kahana Stream",type:"stream",width:1.5,color:"#0277bd",flow:"S",pts:[[21.52,-157.85],[21.50,-157.83],[21.48,-157.81]]},

  // Maui - West slopes
  {name:"Iao Stream (Wailuku)",type:"river",width:2.5,color:"#0277bd",flow:"N",pts:[[20.79,-156.50],[20.81,-156.48],[20.83,-156.46]]},
  {name:"Kapalua Streams Complex",type:"stream_complex",width:2,color:"#0277bd",flow:"N",pts:[[20.97,-156.67],[20.94,-156.65],[20.91,-156.63]]},
  {name:"Lahaina Watershed Runoff",type:"stream",width:1.5,color:"#0277bd",flow:"W",pts:[[20.88,-156.68],[20.86,-156.70],[20.84,-156.72]],flood_severity:"moderate"},

  // Hawaii Island - East side
  {name:"Wailuku River (Hilo Main)",type:"river",width:3,color:"#0277bd",flow:"E",pts:[[19.72,-155.12],[19.70,-155.10],[19.68,-155.08]]},
  {name:"Honolii Stream (Hilo)",type:"stream",width:1.5,color:"#0277bd",flow:"E",pts:[[19.74,-155.08],[19.72,-155.06],[19.70,-155.04]]},

  // Kauai - Eastern rivers
  {name:"Wailua River (Kauai Main)",type:"river",width:2.5,color:"#0277bd",flow:"E",pts:[[22.08,-159.40],[22.06,-159.37],[22.04,-159.34]]},
  {name:"Hanalei River (North Shore)",type:"river",width:2,color:"#0277bd",flow:"N",pts:[[22.21,-159.51],[22.208,-159.50],[22.205,-159.49]]},
  {name:"Waimea River (West Kauai)",type:"river",width:2,color:"#0277bd",flow:"N",pts:[[22.07,-159.70],[22.06,-159.67],[22.05,-159.64]]},
];

// ── COLOR MAPPINGS FOR SEVERITY ──────────────────────────────────────────────
var colMap={critical:'rgba(230,81,0,.55)',high:'rgba(216,27,96,.45)',moderate:'rgba(249,168,37,.35)'};
var borderMap={critical:'#E65100',high:'#D81B60',moderate:'#F9A825'};

// Contamination risk colors
var contamRiskColor={critical:'#8b0000',high:'#d81b60',moderate:'#f9a825',low:'#fbc02d'};
var contamRiskBorder={critical:'#8b0000',high:'#d81b60',moderate:'#f9a825',low:'#fbc02d'};

// ── SOIL DATA WITH PINEAPPLE SOIL CONTAMINATION INFO ────────────────────────
// Source: Hawaii Digital Soil Survey (USDA/NRCS via https://geoportal.hawaii.gov/datasets/d246843c079d45dbb827e63062e4a509_42)
// Pineapple soils (primarily Mollisol/Oxisol series: Waialua, Ala, Molokai, Mahiki)
// These volcanic soils have HIGH IRON OXIDE content (15-35% Fe2O3) which impacts flood behavior
var SOIL_DATA = {
  pineapple_oahu: [
    {name:"Oahu Pineapple Soil Zone — Waialua Series",island:"Oahu",soil_type:"Hydrous Kanhaplic Humoxisol",
     parent_material:"Basaltic lava flows (Pleistocene)",elevation_ft:2000,iron_oxide_pct:"22-28%",
     coords:[[21.54,-158.13],[21.62,-158.13],[21.62,-158.08],[21.54,-158.08]],
     hazards:["High iron content creates laterite hardpan — reduces infiltration",
              "Perched water tables increase lateral runoff concentration","5-15 ton/acre/year erosion post-abandonment"],
     flood_impact:"Iron-rich subsurface acts as impermeable barrier. Increases flood peak flow magnitude by 30-50% vs sandy soils.",
     desc:"Historically dominant pineapple cultivation zone. High iron oxide creates cemented lower horizons that impede water drainage and increase flood runoff. Soils are vulnerable to gully erosion once vegetative cover is removed.",
     source_url:"https://soilseries.sc.egov.usda.gov/OSD_Docs/W/WAIALUA.html"},
    {name:"Central Oahu Pineapple Soil Zone — Ala Series",island:"Oahu",soil_type:"Humic Acrudox",
     parent_material:"Volcanic ash over basalt",elevation_ft:1500,iron_oxide_pct:"18-24%",
     coords:[[21.48,-158.06],[21.55,-158.06],[21.55,-157.98],[21.48,-157.98]],
     hazards:["Iron hydrate cementation layer at 20-40 inches depth",
              "When saturated, represents slip surface for landslides","Slippery interface between iron-rich and upper soil layers"],
     flood_impact:"Iron-cemented horizons prevent downward water movement. All infiltration becomes lateral flow along clay layers, concentrating water into draws and gullies. Increases gully erosion potential 10-20x.",
     desc:"Secondary pineapple zone with more pronounced iron accumulation. Properties make soils prone to slippage after saturation, increasing landslide risk on slopes >20 degrees.",
     source_url:"https://soilseries.sc.egov.usda.gov/OSD_Docs/A/ALA.html"}
  ],
  pineapple_maui: [
    {name:"Maui Pineapple Zone — Molokai Series",island:"Maui",soil_type:"Hydrous Kanhaplic Humoxisol",
     parent_material:"Basaltic lava (West Maui volcanic)",elevation_ft:2200,iron_oxide_pct:"24-30%",
     coords:[[20.87,-156.66],[20.95,-156.66],[20.95,-156.58],[20.87,-156.58]],
     hazards:["Among highest iron content in Hawaii (24-30%)",
              "Steep terrain (20-35 degree slopes) + high clay content","Post-wildfire soil destabilization compounded by iron content"],
     flood_impact:"Most severe flood/landslide risk. Iron-rich soils mixed with 2023 wildfire charred root zones create dual hazard: rapid runoff + slope instability. 62 inches rain in 2026 event mobilized debris flows in multiple gulches.",
     desc:"West Maui's primary pineapple legacy zone. Extremely high iron oxide creates very low hydraulic conductivity and permeability. Combined with post-wildfire conditions, this represents CRITICAL flood and debris flow risk for Lahaina area.",
     source_url:"https://soilseries.sc.egov.usda.gov/OSD_Docs/M/MOLOKAI.html"}
  ],
  pineapple_kauai: [
    {name:"Kauai Pineapple Zone — Mahiki Series",island:"Kauai",soil_type:"Humic Torrox",
     parent_material:"Weathered basalt",elevation_ft:1800,iron_oxide_pct:"20-26%",
     coords:[[22.04,-159.65],[22.12,-159.65],[22.12,-159.53],[22.04,-159.53]],
     hazards:["High iron content with steep island morphology",
              "Valley concentrations create flash flood channels","Highly erodible once vegetation removed"],
     flood_impact:"Iron-rich soils accelerate runoff into narrow valley systems. Creates high-velocity flood peaks in tributary streams. 10+ inches rainfall generates significant debris flow risk.",
     desc:"Kauai's main pineapple cultivation area. Soils exhibit classic iron-oxide weathering pattern. Combination of soil properties and steep terrain makes this area prone to rapid flash flooding.",
     source_url:"https://soilseries.sc.egov.usda.gov/OSD_Docs/M/MAHIKI.html"}
  ]
};

// ── ATMOSPHERIC RIVER FORECAST DATA (CW3E / UCSD) ──────────────────────────────
// Source: Center for Western Weather and Water Extremes (CW3E)
// URL: https://cw3e.ucsd.edu/iwv-and-ivt-forecasts/
// Integrated Water Vapor Transport (IVT) thresholds for AR detection
var ATMOSPHERIC_RIVERS = [
  {name:"Atmospheric River Track — March 14-15 Kona Low 1",
   pts:[[20.0,-158.5],[20.5,-158.0],[21.0,-157.8],[21.5,-157.5]],
   ivt_peak:"385 kg m-1 s-1",ar_classification:"Category 4 (Extreme)",
   duration_hours:36,rainfall_total:"5-12 inches (Oahu North Shore)",
   desc:"First atmospheric river event. Very strong IVT values indicate exceptional moisture transport. Result: Widespread heavy rain across entire state.",
   model:"NCEP GFS / ECMWF",issued:"March 12, 2026",url:"https://cw3e.ucsd.edu/arscale/"},
  {name:"Atmospheric River Track — March 22-24 Kona Low 2",
   pts:[[19.5,-160.0],[20.2,-159.2],[20.8,-158.5],[21.5,-157.8]],
   ivt_peak:"412 kg m-1 s-1",ar_classification:"Category 5 (Exceptional)",
   duration_hours:48,rainfall_total:"2-4 in/hr (Mānoa/Pālolo 'rain bomb')",
   desc:"Second atmospheric river. Produced exceptional IVT values — among highest recorded for Hawaii events. Created stationary cell over Honolulu producing extreme point rainfall.",
   model:"NCEP GFS / ECMWF / GEFS Ensemble",issued:"March 20, 2026",url:"https://cw3e.ucsd.edu/arscale/"},
];

// ── CENSUS DATA LAYER (Population density exposure) ──────────────────────────
// Source: 2020 US Census via Hawaii Geoportal
// URL: https://geoportal.hawaii.gov/datasets/1815a6c2c1fc40c39e575f7330dd62c6_34
var CENSUS_DATA = [
  {name:"High Population Density — Honolulu (>1,200 per sq mi)",
   coords:[[21.28,-157.88],[21.35,-157.88],[21.35,-157.78],[21.28,-157.78]],
   population:2800,population_density:1450,households:900,median_income:"$73,500",
   flood_exposure:"CRITICAL",people_at_risk:2500,
   desc:"Central Honolulu. March 23 'rain bomb' affected this densely populated area with unexpected flooding due to perched water table in urban soils.",
   source_url:"https://geoportal.hawaii.gov/datasets/1815a6c2c1fc40c39e575f7330dd62c6_34"},
  {name:"Medium-High Population Density — Waialua/Haleiwa (400-600 per sq mi)",
   coords:[[21.57,-158.12],[21.65,-158.12],[21.65,-157.98],[21.57,-157.98]],
   population:8200,population_density:520,households:2100,median_income:"$71,200",
   flood_exposure:"CRITICAL",people_at_risk:5500,
   desc:"North Shore Oahu. Worst-hit area with 236 rescued. Kaukonahua Stream overflow inundated both agricultural and residential areas.",
   source_url:"https://geoportal.hawaii.gov/datasets/1815a6c2c1fc40c39e575f7330dd62c6_34"},
  {name:"Medium Population Density — West Maui (280-450 per sq mi)",
   coords:[[20.85,-156.72],[20.93,-156.72],[20.93,-156.62],[20.85,-156.62]],
   population:1200,population_density:380,households:320,median_income:"$68,900",
   flood_exposure:"high",people_at_risk:850,
   desc:"Lahaina. Still in wildfire recovery phase. 62 inches rain and pineapple soil properties created compounded flood/debris hazard.",
   source_url:"https://geoportal.hawaii.gov/datasets/1815a6c2c1fc40c39e575f7330dd62c6_34"},
];

// ── IMPERVIOUS SURFACE DATA ────────────────────────────────────────────────────
// Source: Multi-Resolution Land Characteristics (NLCD) Fractional Impervious Surface
// URL: https://www.mrlc.gov/data/type/fractional-impervious-surface
// Data: 2021 NLCD Annual Impervious Surface (30-meter resolution)
var IMPERVIOUS_SURFACE = [
  {name:"High Impervious Surface — Honolulu Urban Core (60-100%)",
   coords:[[21.29,-157.86],[21.33,-157.86],[21.33,-157.80],[21.29,-157.80]],
   impervious_pct:"75-85%",land_use:"Dense commercial/residential",area_sq_miles:2.3,
   flood_risk_increase:"40-60% higher peak flows vs permeable baseline",
   runoff_coeff:0.85,stormwater_capacity:"Exceeded during 2026 event",
   desc:"Downtown Honolulu with extensive pavement, rooftops, and impervious surfaces. 75%+ coverage means virtually all rainfall becomes surface runoff. March 23 rain bomb overwhelmed stormwater infrastructure.",
   climate_impact:"Urban heat island effect increases local convection; contributes to stationary rainfall cells over developed areas.",
   source_url:"https://www.mrlc.gov/data/type/fractional-impervious-surface"},
  {name:"Medium Impervious Surface — Waialua Town (30-50%)",
   coords:[[21.57,-158.10],[21.62,-158.10],[21.62,-158.04],[21.57,-158.04]],
   impervious_pct:"40-50%",land_use:"Rural estate/mixed agriculture",area_sq_miles:5.2,
   flood_risk_increase:"20-35% higher peak flows",
   runoff_coeff:0.55,stormwater_capacity:"Rural drainage inadequate for extreme events",
   desc:"Waialua-Haleiwa area. Mix of agricultural land with increasing residential development. Inadequate stormwater infrastructure for the scale of 2026 event (8-12 inches in 36 hours).",
   satellite_note:"ESA Urbinsule project shows expanding impervious surface in this region since 2010.",
   source_url:"https://www.mrlc.gov/data/type/fractional-impervious-surface"},
  {name:"Low Impervious Surface — West Maui Agricultural (10-25%)",
   coords:[[20.87,-156.68],[20.95,-156.68],[20.95,-156.56],[20.87,-156.56]],
   impervious_pct:"15-20%",land_use:"Agriculture + scattered homes",area_sq_miles:8.5,
   flood_risk_increase:"5-15% vs baseline",
   runoff_coeff:0.35,stormwater_capacity:"Natural infiltration + drainage; overwhelmed by 62 inch total",
   desc:"Historic pineapple and agriculture zone. Lower impervious coverage but HIGH erosion risk due to iron-rich pineapple soils and post-wildfire conditions. 62 inches rain mobilized debris flows despite low urban coverage.",
   pineapple_soil_note:"Molokai/Mahiki series soils in this zone have 24-30% Fe2O3; iron oxide creates low permeability despite agricultural use.",
   source_url:"https://www.mrlc.gov/data/type/fractional-impervious-surface"},
];
