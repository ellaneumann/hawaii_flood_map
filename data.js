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
  {na