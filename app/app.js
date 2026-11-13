const screens=[...document.querySelectorAll('.screen')];
const navLinks=[...document.querySelectorAll('.bottom-nav a')];
function showScreen(){
  const id=(location.hash||'#home').slice(1);
  const target=document.getElementById(id) || document.getElementById('home');
  screens.forEach(s=>s.classList.toggle('active',s===target));
  navLinks.forEach(a=>a.classList.toggle('active',a.dataset.nav===target.id));
  document.title=`${target.dataset.title||'Road 2 Safety'} | Road 2 Safety Navigator`;
  window.scrollTo({top:0,behavior:'instant'});
}
addEventListener('hashchange',showScreen); showScreen();

const settings=document.getElementById('settings');
const settingsBtn=document.getElementById('settingsBtn');
const closeBtn=document.getElementById('settingsClose');
function toggleSettings(open){settings.classList.toggle('open',open);settingsBtn.setAttribute('aria-expanded',String(open));}
settingsBtn.addEventListener('click',()=>toggleSettings(!settings.classList.contains('open')));
closeBtn.addEventListener('click',()=>toggleSettings(false));

const large=document.getElementById('largeText');
const saver=document.getElementById('dataSaver');
function applyPrefs(){
  const isLarge=localStorage.getItem('r2s-large-text')==='1';
  const isSaver=localStorage.getItem('r2s-data-saver')==='1';
  document.body.classList.toggle('large-text',isLarge); document.body.classList.toggle('data-saver',isSaver);
  large.checked=isLarge; saver.checked=isSaver;
}
large.addEventListener('change',()=>{localStorage.setItem('r2s-large-text',large.checked?'1':'0');applyPrefs();});
saver.addEventListener('change',()=>{localStorage.setItem('r2s-data-saver',saver.checked?'1':'0');applyPrefs();});
document.getElementById('resetSettings').addEventListener('click',()=>{localStorage.removeItem('r2s-large-text');localStorage.removeItem('r2s-data-saver');applyPrefs();});
applyPrefs();

document.querySelectorAll('.route-btn').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.nav-panel').forEach(p=>p.classList.remove('show'));
  document.getElementById(btn.dataset.panel)?.classList.add('show');
  document.querySelector('.panel-shell')?.scrollIntoView({behavior:'smooth',block:'start'});
}));

document.querySelectorAll('[data-open-panel]').forEach(a=>a.addEventListener('click',()=>{
  const panel=a.dataset.openPanel;
  setTimeout(()=>{document.querySelectorAll('.nav-panel').forEach(p=>p.classList.remove('show'));document.getElementById(panel)?.classList.add('show');},40);
}));

document.querySelectorAll('[data-focus-programme]').forEach(a=>a.addEventListener('click',()=>{
  const id=a.dataset.focusProgramme;
  setTimeout(()=>{const d=document.getElementById(id); if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'center'});}},60);
}));

let installEvent; const installPrompt=document.getElementById('installPrompt');
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;installPrompt.hidden=false;});
document.getElementById('installBtn').addEventListener('click',async()=>{if(!installEvent)return;installEvent.prompt();await installEvent.userChoice;installEvent=null;installPrompt.hidden=true;});
document.getElementById('installDismiss').addEventListener('click',()=>installPrompt.hidden=true);
if('serviceWorker' in navigator) addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
