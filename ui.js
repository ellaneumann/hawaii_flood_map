/* ────────────────────────────────────────────────────────────────────────────────
   HAWAII FLOODWATCH — UI & INTERACTIONS
   Handles tabs, sidebar, island cards, and vulnerability scenarios
   ──────────────────────────────────────────────────────────────────────────────── */

// ── ISLAND TAB RENDERING ───────────────────────────────────────────────────────
function renderIslands(){
  var el=document.getElementById('island-scroll');
  el.innerHTML='';
  ISLANDS.forEach(function(isl){
    var div=document.createElement('div');
    div.className='island-card';
    div.innerHTML=
      '<div class="island-name">'+isl.name+'<span class="island-badge" style="background:'+isl.color+'">'+isl.severity+'</span></div>'+
      '<div class="island-stats">'+
        '<div class="istat"><div class="istat-v">'+isl.maxRain+'</div><div class="istat-l">Max rain</div></div>'+
        '<div class="istat"><div class="istat-v">'+(isl.rescued||'N/A')+'</div><div class="istat-l">Rescued</div></div>'+
        '<div class="istat"><div class="istat-v">'+(isl.evacuated||'N/A')+'</div><div class="istat-l">Evacuated</div></div>'+
      '</div>'+
      '<div class="island-desc">'+isl.desc+'</div>';
    // Click card → fly to island
    div.addEventListener('click',function(e){
      if(e.target.tagName==='A') return;
      map.flyTo([isl.lat,isl.lng],isl.zoom,{duration:1.2});
    });
    el.appendChild(div);
  });
}
renderIslands();

// ── HOW-TO MODAL ───────────────────────────────────────────────────────────────
// Show on first visit; remember the choice in localStorage so it doesn't reappear
function closeHowTo(){
  document.getElementById('howto-overlay').classList.add('hidden');
  try{localStorage.setItem('hwft_seen','1');}catch(e){}
}
// If the user has already seen it, hide immediately without waiting for a click
(function(){
  try{if(localStorage.getItem('hwft_seen')){document.getElementById('howto-overlay').classList.add('hidden');}}catch(e){}
})();

// ── TABS ───────────────────────────────────────────────────────────────────────
var fviAutoEnabled = false;
function ST(name){
  var names=['vulnerability','layers','event','islands'];
  document.querySelectorAll('.tab').forEach(function(t,i){t.classList.toggle('active',names[i]===name);});
  document.querySelectorAll('.panel').forEach(function(p){p.classList.toggle('active',p.id==='tab-'+name);});
  // Auto-enable FVI heatmap on first visit to vulnerability tab
  if(name==='vulnerability' && !fviAutoEnabled){
    fviAutoEnabled=true;
    if(typeof LON!=='undefined' && !LON.fvi) TL('fvi');
    if(typeof recalcFVI==='function') recalcFVI();
    if(typeof map!=='undefined') map.flyTo([21.48,-157.97],11,{duration:1.2});
  }
}

// ── SIDEBAR TOGGLE ─────────────────────────────────────────────────────────────
var sbOpen=true;
function applySidebarState(){
  var sb=document.getElementById('sidebar');
  var btn=document.getElementById('sb-toggle');
  if(window.innerWidth>768){
    sb.classList.toggle('collapsed',!sbOpen);
    sb.classList.remove('open');
  } else {
    sb.classList.toggle('open',sbOpen);
    sb.classList.remove('collapsed');
  }
  if(btn) btn.innerHTML=sbOpen?'&#10094;':'&#10095;';
}
function toggleSidebar(){
  sbOpen=!sbOpen;
  applySidebarState();
  setTimeout(function(){if(map)map.invalidateSize();},280);
}
// Ensure proper state on window resize
window.addEventListener('resize',function(){
  applySidebarState();
  if(map)map.invalidateSize();
});

// ── VULNERABILITY SCENARIO SELECTION ──────────────────────────────────────────
function selectScenario(key) {
  document.querySelectorAll('.fvi-scenario').forEach(function(el) {
    el.classList.toggle('active', el.id === 'scen-' + key);
  });
  if (typeof applyScenario === 'function') {
    applyScenario(key);
  }
}

// ── GUIDED TOUR ───────────────────────────────────────────────────────────────
var TOUR_STEPS = [
  {
    targetId: 'fvi-stats-summary',
    title: 'The plantation footprint in numbers',
    body: 'These three stats show how many high-risk zones carry measurable plantation-era soil hardpan, how many could move out of High risk if lo\'i kalo is restored, and how many overlap the 1906 dam\'s evacuation footprint.',
    position: 'below',
    scrollTo: true,
    ensureTab: 'vulnerability'
  },
  {
    targetId: 'fvi-scenario-list',
    title: 'Policy scenarios: compare futures',
    body: 'Each scenario shifts the flood model based on land-use or climate changes. Indigenous Land Restoration is selected by default — it applies measured effects from real Hawaiian lo\'i kalo restoration sites.',
    position: 'below',
    scrollTo: true,
    ensureTab: 'vulnerability'
  },
  {
    targetId: 'scen-indigenousRestore',
    title: 'What lo\'i kalo restoration does',
    body: 'Based on published research: 75% reduction in iron oxide hardpan flood contribution, 45% improvement in soil drainage, 20% stream-flow attenuation. These are research-supported estimates, not guaranteed outcomes.',
    position: 'right',
    scrollTo: true,
    ensureTab: 'vulnerability'
  },
  {
    targetId: 'fvi-recalc-btn',
    title: 'Recalculate the model',
    body: 'After selecting a scenario or adjusting the 9 weight sliders, hit this to recompute the flood index across all of O\'ahu. The heatmap and stats update immediately.',
    position: 'above',
    scrollTo: true,
    ensureTab: 'vulnerability'
  },
  {
    targetId: 'map',
    title: 'Click anywhere on the map',
    body: 'Tap any colored grid cell to see a popup showing the FVI score and which of the 9 factors drives the risk at that exact location — elevation, soil, iron oxide, March 2026 impact, and more.',
    position: 'center'
  },
  {
    targetId: null,
    tabHighlight: true,
    title: 'Explore the Layers tab',
    body: 'Switch to Layers to toggle FEMA flood zones, the USGS stream network, watershed boundaries, pineapple soils, and the discrepancy map showing where the 9-factor model sees risk that FEMA doesn\'t.',
    position: 'below',
    ensureTab: null
  }
];

var _tourStep = 0;
var _tourActive = false;
var _tourHighlighted = null;

function startTour() {
  _tourStep = 0;
  _tourActive = true;
  document.getElementById('tour-dim').classList.remove('hidden');
  document.getElementById('tour-card').classList.remove('hidden');
  _renderTourStep();
}

function endTour() {
  _tourActive = false;
  document.getElementById('tour-dim').classList.add('hidden');
  document.getElementById('tour-card').classList.add('hidden');
  _clearTourHighlight();
}

function tourNext() {
  _tourStep++;
  if (_tourStep >= TOUR_STEPS.length) {
    endTour();
    return;
  }
  _renderTourStep();
}

function _clearTourHighlight() {
  if (_tourHighlighted) {
    _tourHighlighted.classList.remove('tour-highlight-ring');
    _tourHighlighted = null;
  }
}

function _renderTourStep() {
  var step = TOUR_STEPS[_tourStep];
  var isLast = _tourStep === TOUR_STEPS.length - 1;

  // Switch tab if needed
  if (step.ensureTab) ST(step.ensureTab);

  // Update card content
  document.getElementById('tour-count').textContent = 'Step ' + (_tourStep + 1) + ' of ' + TOUR_STEPS.length;
  document.getElementById('tour-card-title').textContent = step.title;
  document.getElementById('tour-card-body').textContent = step.body;
  document.getElementById('tour-next-btn').textContent = isLast ? 'Finish' : 'Next';

  _clearTourHighlight();

  // Handle tab highlight (last step)
  if (step.tabHighlight) {
    var tabs = document.querySelector('.tabs');
    if (tabs) {
      tabs.classList.add('tour-highlight-ring');
      _tourHighlighted = tabs;
    }
    _positionTourCard(tabs, 'below');
    return;
  }

  if (!step.targetId) {
    _positionTourCard(null, 'center');
    return;
  }

  var el = document.getElementById(step.targetId);
  if (!el) {
    _positionTourCard(null, 'center');
    return;
  }

  // Scroll into view
  if (step.scrollTo) {
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  // Highlight
  el.classList.add('tour-highlight-ring');
  _tourHighlighted = el;

  setTimeout(function() {
    _positionTourCard(el, step.position);
  }, step.scrollTo ? 250 : 0);
}

function _positionTourCard(el, position) {
  var card = document.getElementById('tour-card');
  var cardW = 270;
  var cardH = card.offsetHeight || 170;
  var margin = 14;
  var vpW = window.innerWidth;
  var vpH = window.innerHeight;

  if (!el || position === 'center') {
    card.style.left = Math.round((vpW - cardW) / 2) + 'px';
    card.style.top = Math.round(vpH * 0.38) + 'px';
    return;
  }

  var r = el.getBoundingClientRect();

  var top, left;

  if (position === 'below') {
    top = r.bottom + margin;
    left = r.left;
  } else if (position === 'above') {
    top = r.top - cardH - margin;
    left = r.left;
  } else if (position === 'right') {
    top = r.top;
    left = r.right + margin;
  } else {
    top = r.bottom + margin;
    left = r.left;
  }

  // Clamp to viewport
  if (left + cardW > vpW - 8) left = vpW - cardW - 8;
  if (left < 8) left = 8;
  if (top + cardH > vpH - 8) top = vpH - cardH - 8;
  if (top < 8) top = 8;

  card.style.left = Math.round(left) + 'px';
  card.style.top = Math.round(top) + 'px';
}

// ── INITIALIZATION ────────────────────────────────────────────────────────────
// Page opens on Vulnerability tab — trigger auto-enable after scripts load
setTimeout(function(){ ST('vulnerability'); }, 50);
