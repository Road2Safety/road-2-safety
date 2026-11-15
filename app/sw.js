const CACHE='r2s-prototype-professional-20261115-1';
const CORE=['../assets/street/country-cloth.webp','../assets/street/brand-mark.webp','./','./index.html','./app.css?v=professional-1','./app.js?v=street-4','./manifest.webmanifest','./offline.html','../assets/street/street.css?v=street-4','../assets/street/grain.svg','../assets/fonts/fonts.css?v=street-3','../assets/fonts/barlow-condensed-900.woff2?v=street-3','../assets/fonts/dm-sans-400.woff2?v=street-3','../assets/fonts/dm-sans-700.woff2?v=street-3','../assets/fonts/rubik-dirt.woff2?v=street-3','../assets/street/icon-192.png','../assets/street/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const previous=(await caches.keys()).filter(key=>key.startsWith('r2s-prototype-')&&key!==CACHE);
 await Promise.all(previous.map(key=>caches.delete(key)));await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(response=>{
   if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}return response;
  }).catch(()=>caches.match(request).then(cached=>cached||caches.match('./index.html'))));return;
 }
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}return response;
 })));
});
