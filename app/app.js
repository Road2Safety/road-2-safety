const screens=[...document.querySelectorAll('.screen')];
const navLinks=[...document.querySelectorAll('.bottom-nav a')];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let pendingPanel=null;
function selectPanel(id,focus=false){
 const panel=document.getElementById(id);
 if(!panel?.classList.contains('nav-panel'))return;
 document.querySelectorAll('.nav-panel').forEach(p=>p.classList.toggle('show',p===panel));
 document.querySelectorAll('.route-btn').forEach(button=>button.setAttribute('aria-expanded',String(button.dataset.panel===id)));
 if(focus){const heading=panel.querySelector('h2');heading.tabIndex=-1;heading.focus({preventScroll:true});document.querySelector('.panel-shell').scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});}
}
function showScreen(focus=false){
 const id=(location.hash||'#home').slice(1);
 if(id==='content'){document.getElementById('content').focus();return;}
 const target=screens.find(screen=>screen.id===id)||document.getElementById('home');
 screens.forEach(s=>s.classList.toggle('active',s===target));
 navLinks.forEach(a=>{const active=a.dataset.nav===target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 document.title=`${target.dataset.title||'Home'} | Road 2 Safety Navigator`;
 window.scrollTo({top:0,behavior:'instant'});
 if(pendingPanel && target.id==='navigator'){const panel=pendingPanel;pendingPanel=null;selectPanel(panel,true);}
 else if(focus){const heading=target.querySelector('h1');heading.tabIndex=-1;heading.focus({preventScroll:true});}
 hydrateArtwork();
}
addEventListener('hashchange',()=>showScreen(true));
const settings=document.getElementById('settings');
const settingsBtn=document.getElementById('settingsBtn');
function toggleSettings(open){if(open&&!settings.open)settings.showModal();if(!open&&settings.open)settings.close();settingsBtn.setAttribute('aria-expanded',String(open));}
settingsBtn.addEventListener('click',()=>toggleSettings(!settings.open));
document.getElementById('settingsClose').addEventListener('click',()=>toggleSettings(false));
settings.addEventListener('close',()=>{settingsBtn.setAttribute('aria-expanded','false');settingsBtn.focus();});
const large=document.getElementById('largeText');
const saver=document.getElementById('dataSaver');
const memoryPrefs={};
function readPref(key){try{return localStorage.getItem(key)??memoryPrefs[key]??null;}catch{return memoryPrefs[key]??null;}}
function writePref(key,value){memoryPrefs[key]=value;try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}catch{}}
function hydrateArtwork(){
 const save=readPref('r2s-data-saver')==='1';
 document.querySelectorAll('[data-art][data-src]').forEach(img=>{
  const active=img.closest('.screen')?.classList.contains('active');
  if(!save && active && !img.hasAttribute('src'))img.src=img.dataset.src;
 });
}
function applyPrefs(){
 const isLarge=readPref('r2s-large-text')==='1';
 const isSaver=readPref('r2s-data-saver')==='1';
 document.documentElement.classList.toggle('large-text',isLarge);
 document.body.classList.toggle('large-text',isLarge);
 document.body.classList.toggle('data-saver',isSaver);
 large.checked=isLarge;saver.checked=isSaver;hydrateArtwork();
}
large.addEventListener('change',()=>{writePref('r2s-large-text',large.checked?'1':'0');applyPrefs();});
saver.addEventListener('change',()=>{writePref('r2s-data-saver',saver.checked?'1':'0');applyPrefs();});
document.getElementById('resetSettings').addEventListener('click',()=>{writePref('r2s-large-text',null);writePref('r2s-data-saver',null);applyPrefs();});
document.querySelectorAll('.route-btn').forEach(btn=>{
 btn.setAttribute('aria-controls',btn.dataset.panel);btn.setAttribute('aria-expanded','false');
 btn.addEventListener('click',()=>selectPanel(btn.dataset.panel,true));
});
document.querySelectorAll('[data-open-panel]').forEach(a=>a.addEventListener('click',event=>{
 event.preventDefault();pendingPanel=a.dataset.openPanel;
 if(location.hash==='#navigator')showScreen(true);else location.hash='#navigator';
}));
document.querySelectorAll('[data-focus-programme]').forEach(a=>a.addEventListener('click',()=>{
 const id=a.dataset.focusProgramme;
 requestAnimationFrame(()=>{const d=document.getElementById(id);if(d){d.open=true;d.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'center'});}});
}));
let installEvent;const installPrompt=document.getElementById('installPrompt');
addEventListener('beforeinstallprompt',event=>{event.preventDefault();installEvent=event;installPrompt.hidden=false;});
document.getElementById('installBtn').addEventListener('click',async()=>{if(!installEvent)return;await installEvent.prompt();await installEvent.userChoice;installEvent=null;installPrompt.hidden=true;});
document.getElementById('installDismiss').addEventListener('click',()=>installPrompt.hidden=true);
applyPrefs();showScreen();
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(()=>{}));
