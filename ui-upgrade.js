/* Blood Bank UI upgrade: display-only helpers. Does not touch Supabase or app logic. */
(function(){try{
var $=function(i){return document.getElementById(i)};

/* 1. Avatar circle with the first letter of the logged-in email */
var who=$("who"),lo=$("lo");
if(who&&lo){
 var av=document.createElement("span");av.className="av";av.style.display="none";
 lo.parentNode.insertBefore(av,$("lg"));
 var sync=function(){var e=(who.textContent||"").trim();av.style.display=e?"inline-grid":"none";av.textContent=e?e.charAt(0).toUpperCase():""};
 new MutationObserver(sync).observe(who,{childList:true,characterData:true,subtree:true});sync();
}

/* 2. Toast when "Saved" / "Request sent" / "Accepted" messages appear */
var toast=document.createElement("div");toast.id="toast";document.body.appendChild(toast);
var tm;function show(m){toast.textContent=m;toast.classList.add("show");clearTimeout(tm);tm=setTimeout(function(){toast.classList.remove("show")},2600)}
["rm","dm"].forEach(function(id){var n=$(id);if(!n)return;
 new MutationObserver(function(){var m=(n.textContent||"").trim();if(m&&n.className.indexOf("g")>-1)show("\u2705 "+m)}).observe(n,{childList:true,characterData:true,subtree:true})});

/* 3. Scroll to top when switching tabs */
document.querySelectorAll("#tabs button").forEach(function(b){b.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"})})});
}catch(e){}})();

/* ===== Home hero + AI quick questions (display only, reuses existing buttons) ===== */
(function(){try{
var $=function(i){return document.getElementById(i)};
var T={en:{t:"Need blood urgently?",s:"Send a request. Donors with your blood group in your district are notified instantly.",a:"Request blood",b:"Become a donor",e:"National emergency",q:["Who can donate blood?","Which blood group is rare?","How do I use this site?"]},
bn:{t:"জরুরি রক্ত দরকার?",s:"আবেদন পাঠান। আপনার জেলার একই গ্রুপের ডোনারদের সাথে সাথে জানানো হবে।",a:"রক্ত চাই",b:"ডোনার হই",e:"জাতীয় জরুরি সেবা",q:["কে রক্ত দিতে পারে?","কোন রক্তের গ্রুপ বিরল?","সাইটটা কীভাবে ব্যবহার করব?"]}};
var rq=$("v-rq"),ai=$("v-ai"),hero=document.createElement("div"),chips=document.createElement("div");
hero.className="hero";chips.className="qc";
if(rq)rq.insertBefore(hero,rq.firstChild);
if(ai&&$("aq"))ai.querySelector(".c").insertBefore(chips,$("aq"));
function mk(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function render(){
 var L=(typeof lang!=="undefined"&&lang==="bn")?T.bn:T.en;
 hero.textContent="";
 hero.append(mk("h2","",L.t),mk("p","",L.s));
 var hb=mk("div","hb"),a=mk("button","",L.a),b=mk("button","o",L.b);
 a.type=b.type="button";
 a.onclick=function(){var f=$("rf");if(f)f.scrollIntoView({behavior:"smooth",block:"start"})};
 b.onclick=function(){var d=document.querySelector('#tabs button[data-t="dp"]');if(d)d.click()};
 hb.append(a,b);hero.append(hb);
 var em=mk("div","em",L.e+": 999"),call=mk("a","","Call");call.href="tel:999";em.append(call);hero.append(em);
 chips.textContent="";
 L.q.forEach(function(q){var c=mk("button","",q);c.type="button";c.onclick=function(){$("aq").value=q;$("as").click()};chips.append(c)});
}
render();
var lb=$("lg");if(lb)lb.addEventListener("click",function(){setTimeout(render,0)});
}catch(e){}})();
/* ===== Side Drawer Menu ===== */
/* ===== Side Drawer Menu v2 ===== */
(function () {
  if (window.__bbDrawer) return;
  window.__bbDrawer = true;

  var ITEMS = [
    { ic: '🩸', label: 'রক্ত চাই', words: ['request blood', 'রক্ত চাই'] },
    { ic: '🔔', label: 'নোটিফিকেশন', words: ['notifications', 'নোটিফিকেশন'] },
    { ic: '📋', label: 'আমার রিকোয়েস্ট', words: ['my requests', 'আমার'] },
    { ic: '👤', label: 'ডোনার প্রোফাইল', words: ['donor profile', 'ডোনার'] },
    { ic: '🤖', label: 'Ask AI', words: ['ask'] },
    { line: true },
    { ic: '🚪', label: 'লগআউট', words: ['logout', 'log out', 'sign out', 'লগআউট'], red: true }
  ];

  var btn = document.createElement('button');
  btn.className = 'bb-menu-btn';
  btn.innerHTML = '&#9776;';
  btn.setAttribute('aria-label', 'Menu');

  function goTo(words) {
    var els = document.querySelectorAll('button,a,[role=button],[onclick]');
    for (var i = 0; i < els.length; i++) {
      if (els[i].closest('#bbDrawer') || els[i] === btn) continue;
      var t = (els[i].textContent || '').trim().toLowerCase();
      if (!t || t.length > 30) continue;
      for (var j = 0; j < words.length; j++) {
        if (t.indexOf(words[j]) > -1) { els[i].click(); return true; }
      }
    }
    return false;
  }

  function userEmail() {
    var els = document.querySelectorAll('header *, .header *, .app-header *');
    for (var i = 0; i < els.length; i++) {
      if (els[i].children.length) continue;
      var m = (els[i].textContent || '').match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
      if (m) return m[0];
    }
    return '';
  }

  function build() {
    var d = document.createElement('div');
    d.id = 'bbDrawer';
    var html = '<div class="bb-shade"></div><div class="bb-panel">' +
      '<div class="bb-head"><div class="bb-ava">?</div><div><div class="bb-name">অতিথি</div>' +
      '<div class="bb-email"></div></div></div>';
    ITEMS.forEach(function (it, n) {
      if (it.line) { html += '<div class="bb-line"></div>'; return; }
      html += '<button class="bb-item' + (it.red ? ' red' : '') + '" data-bbi="' + n + '">' +
        '<span class="ic">' + it.ic + '</span><span>' + it.label + '</span></button>';
    });
    html += '<div class="bb-ver">Blood Bank — v1.0</div></div>';
    d.innerHTML = html;
    document.body.appendChild(d);

    d.querySelector('.bb-shade').onclick = close;
    d.querySelectorAll('.bb-item').forEach(function (b) {
      b.onclick = function () {
        var it = ITEMS[b.getAttribute('data-bbi')];
        close();
        setTimeout(function () { goTo(it.words); }, 280);
      };
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function open() {
    var d = document.getElementById('bbDrawer');
    var em = userEmail();
    d.querySelector('.bb-ava').textContent = em ? em.charAt(0).toUpperCase() : '?';
    d.querySelector('.bb-name').textContent = em ? em.split('@')[0] : 'অতিথি';
    d.querySelector('.bb-email').textContent = em;
    d.classList.add('open');
  }
  function close() {
    var d = document.getElementById('bbDrawer');
    if (d) d.classList.remove('open');
  }

  function place() {
    var h = document.querySelector('header, .header, .app-header, #header');
    if (!h) {
      if (!btn.isConnected) { btn.classList.add('bb-float'); document.body.appendChild(btn); }
      return;
    }
    btn.classList.remove('bb-float');
    var lo = null, bs = h.querySelectorAll('button,a');
    for (var i = 0; i < bs.length; i++) {
      var t = (bs[i].textContent || '').trim().toLowerCase();
      if (t === 'logout' || t === 'log out' || t === 'লগআউট') { lo = bs[i]; break; }
    }
    if (lo) {
      if (btn.parentNode !== lo.parentNode || btn.nextSibling !== lo) lo.parentNode.insertBefore(btn, lo);
      if (lo.style.display !== 'none') lo.style.display = 'none';
    } else if (btn.parentNode !== h) {
      h.appendChild(btn);
    }
  }

  function init() {
    build();
    btn.onclick = open;
    place();
    var timer;
    new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(place, 100);
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
