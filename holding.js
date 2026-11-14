const menuButton = document.getElementById('menuBtn');
const menu = document.getElementById('siteNav');
function closeMenu() { menu.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); }
menuButton.addEventListener('click', () => { const open = !menu.classList.contains('open'); menu.classList.toggle('open',open); menuButton.setAttribute('aria-expanded',String(open)); });
menu.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
addEventListener('keydown', event => { if(event.key==='Escape' && menu.classList.contains('open')) {closeMenu();menuButton.focus();} });
document.getElementById('shareProject').addEventListener('click', async () => {
 const data={title:'Road 2 Safety — Sierra Leone',text:'Care. Recovery. Community. Opportunity. Help shape the road ahead.',url:'https://road2safety.github.io/road-2-safety/'};
 const status=document.getElementById('shareStatus');
 try {
  if(navigator.share) { await navigator.share(data); status.textContent='Thank you for sharing the project.'; }
  else if(navigator.clipboard && window.isSecureContext) {await navigator.clipboard.writeText(data.url);status.textContent='Project link copied. Share it with your community.';}
  else {status.textContent=data.url;}
 } catch(error) { if(error.name!=='AbortError') status.textContent='Share this link: '+data.url; }
});
