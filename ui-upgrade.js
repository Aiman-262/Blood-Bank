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
