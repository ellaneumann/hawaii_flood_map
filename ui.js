/* ────────────────────────────────────────────────────────────────────────────────
   HAWAII FLOODWATCH — UI & INTERACTIONS
   Handles tabs, sidebar, island cards, news rendering, and weather fetching
   ──────────────────────────────────────────────────────────────────────────────── */

// ── ISLAND TAB RENDERING ───────────────────────────────────────────────────────
function renderIslands(){
  var el=document.getElementById('island-scroll');
  el.innerHTML='';
  ISLANDS.forEach(function(isl,idx){
    var div=document.createElement('div');
    div.className='island-card';
    div.innerHTML=
      '<div class="island-name">'+isl.name+'<span class="island-badge" style="background:'+isl.color+'">'+isl.severity+'</span></div>'+
      '<div class="island-stats">'+
        '<div class="istat"><div class="istat-v">'+isl.maxRain+'</div><div class="istat-l">Max rain</div></div>'+
        '<div class="istat"><div class="istat-v">'+(isl.rescued||'—')+'</div><div class="istat-l">Rescued</div></div>'+
        '<div class="istat"><div class="istat-v">'+(isl.evacuated||'—')+'</div><div class="istat-l">Evacuated</div></div>'+
      '</div>'+
      '<div class="island-desc">'+isl.desc+'</div>'+
      '<button class="actions-toggle" data-idx="'+idx+'" type="button">Actions &amp; Resources <span>&#x25BE;</span></button>'+
      '<div class="actions-body" id="isact-'+idx+'">'+
        isl.actions.map(function(a,i){return '<div class="act-item"><div class="act-num">'+(i+1)+'</div><div><b>'+a.t+'</b> '+a.b+'</div></div>';}).join('')+
      '</div>';
    div.querySelector('.island-card')
    // Click card → fly to island
    div.addEventListener('click',function(e){
      if(e.target.tagName==='BUTTON'||e.target.closest('button')||e.target.tagName==='A') return;
      map.flyTo([isl.lat,isl.lng],isl.zoom,{duration:1.2});
    });
    el.appendChild(div);
  });
}
renderIslands();

// ── TOGGLE ISLAND ACTIONS ──────────────────────────────────────────────────────
document.addEventListener('click',function(e){
  var btn=e.target.classList.contains('actions-toggle')?e.target:e.target.closest('.actions-toggle');
  if(btn){
    var idx=btn.getAttribute('data-idx');
    var panel=document.getElementById('isact-'+idx);
    if(panel){panel.classList.toggle('open');btn.querySelector('span').style.transform=panel.classList.contains('open')?'rotate(180deg)':'';}
  }
});

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

// ── COLLAPSIBLE NEWS SECTION ───────────────────────────────────────────────────
function toggleNewsSection(){
  var body=document.getElementById('news-section-body');
  var arrow=document.getElementById('news-section-arrow');
  if(!body) return;
  body.classList.toggle('open');
  if(arrow) arrow.style.transform=body.classList.contains('open')?'':'rotate(-90deg)';
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

// ── NWS WEATHER ────────────────────────────────────────────────────────────────
async function fetchWeather(){
  try{
    var r=await fetch('https://api.weather.gov/stations/PHNL/observations/latest',{headers:{'Accept':'application/geo+json'}});
    if(!r.ok) throw new Error('HTTP '+r.status);
    var d=await r.json();
    var raw=((d.properties||{}).precipitationLastHour||{}).value;
    var precip=(raw!=null&&!isNaN(raw))?parseFloat((raw*39.3701).toFixed(2)):0;
    document.getElementById('wx-val').textContent=precip>0?precip.toFixed(2)+'" last hr':'0.00" (dry)';
    setSt('NWS Honolulu live','#4CAF50');
  }catch(e){
    document.getElementById('wx-val').textContent='N/A';
    setSt('Weather unavailable','#F9A825');
  }
}
function setSt(t,c){document.getElementById('stext').textContent=t;document.getElementById('sdot').style.background=c;}

// ── NEWS UTILITIES ─────────────────────────────────────────────────────────────
var NK='hi_v1_news',ND='hi_v1_date';

async function fetchNews(force){
  var today=new Date().toISOString().slice(0,10);
  if(!force){try{var cd=localStorage.getItem(ND),cn=localStorage.getItem(NK);if(cd===today&&cn){renderNews(JSON.parse(cn));setSt('NWS live · news updated today','#4CAF50');return;}}catch(e){}}
  document.getElementById('news-box').innerHTML='<div style="padding:20px;text-align:center;font-size:11px;color:var(--g400)"><span class="spin"></span>Searching Hawaii flood news&#8230;</div>';
  document.getElementById('rfbtn').disabled=true;
  document.getElementById('news-label').textContent='Fetching&#8230;';
  try{
    var t=new Date().toISOString().slice(0,10);
    var promptMsg = [
      'Search for 5 very recent news articles (2026) about Hawaii flooding recovery, the March 2026 Kona Low storms, Oahu North Shore flood damage, Waialua Haleiwa flooding, or Hawaii flood relief and FEMA response.',
      'Today is ' + t + '.',
      'Return a JSON array. Each item: y (2026), title, src, tag (one of: Recovery/Damage/Infrastructure/Relief/Climate), tc (hex: Recovery=#004D40 Damage=#E65100 Infrastructure=#005F73 Relief=#7B2D8B Climate=#1E88E5), sum (2 sentences max), full (2-3 paragraphs), url.',
      'Return ONLY the JSON array, no markdown.'
    ].join(' ');

    var payload = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      tools: [{type:'web_search_20250305', name:'web_search'}],
      messages: [{role:'user', content: promptMsg}]
    };

    var r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    var data = await r.json();
    var txt=(data.content||[]).filter(function(b){return b.type==='text';}).map(function(b){return b.text;}).join('');
    var m=txt.match(/\[\s*\{[\s\S]*?\}\s*\]/);
    if(!m)throw new Error('no JSON');
    var ai=JSON.parse(m[0]);
    localStorage.setItem(NK,JSON.stringify(ai));localStorage.setItem(ND,t);
    renderNews(ai);setSt('NWS live - news updated today','#4CAF50');
  }catch(e){
    console.error(e);renderNews([]);
    document.getElementById('news-label').textContent='Archived reports';
    setSt('Archived news','#F9A825');
  }finally{document.getElementById('rfbtn').disabled=false;}
}

function renderNews(ai){
  var box=document.getElementById('news-box');box.innerHTML='';
  var all=ai.map(function(a){return Object.assign({},a,{isAI:true});}).concat(STATIC_NEWS.map(function(a){return Object.assign({},a,{isAI:false});}));
  all.sort(function(a,b){return (b.y||0)-(a.y||0);});
  document.getElementById('news-label').textContent=(ai.length>0?ai.length+' live + ':'')+STATIC_NEWS.length+' archived';
  all.forEach(function(n,i){
    var d=document.createElement('div');d.className='n-card';
    var tc=n.tc||'#607D8B';
    d.innerHTML='<div class="n-hdr" onclick="xNews('+i+')">'
      +'<div class="n-meta"><span class="n-yr">'+(n.y||'2026')+'</span>'
      +'<span class="n-tg" style="background:'+tc+'22;color:'+tc+'">'+(n.tag||'')+'</span>'
      +(n.isAI?'<span class="ai-tg">Live</span>':'')+'</div>'
      +'<div class="n-src">'+(n.src||'')+'</div>'
      +'<div class="n-ttl">'+(n.title||'')+'</div>'
      +'<div class="n-sum">'+(n.sum||n.summary||'')+'</div>'
      +'<button class="n-xbtn" id="nb-'+i+'">Read more</button></div>'
      +'<div class="n-body" id="nb-body-'+i+'"><div class="n-txt">'+(n.full||'')+'</div>'
      +'<a class="n-link" href="'+(n.url||'#')+'" target="_blank">Open source</a></div>';
    box.appendChild(d);
  });
}
function xNews(i){var b=document.getElementById('nb-body-'+i),btn=document.getElementById('nb-'+i);var o=b.classList.toggle('open');btn.textContent=o?'Collapse':'Read more';}

// ── VULNERABILITY SCENARIO SELECTION ──────────────────────────────────────────
function selectScenario(key) {
  document.querySelectorAll('.fvi-scenario').forEach(function(el) {
    el.classList.toggle('active', el.id === 'scen-' + key);
  });
  if (typeof applyScenario === 'function') {
    applyScenario(key);
  }
}

// ── INITIALIZATION ────────────────────────────────────────────────────────────
fetchWeather();
fetchNews(false);
setInterval(fetchWeather,600000); // Refresh weather every 10 minutes

// Page opens on Vulnerability tab — trigger auto-enable after scripts load
setTimeout(function(){ ST('vulnerability'); }, 50);
