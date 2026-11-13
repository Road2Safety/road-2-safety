const CACHE='r2s-prototype-v4';
const CORE=['./','./index.html','./app.css?v=4','./heritage.css?v=4','./app.js?v=4','./manifest.webmanifest','./offline.html','../assets/r2s-emblem.png','../assets/icon-192.png','../assets/icon-512.png','../assets/healing-pathways.png','../assets/r2s-sierra-leone.png','../assets/navigator-art.png','../assets/bridging-communities.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const previous=(await caches.keys()).filter(key=>key.startsWith('r2s-prototype-')&&key!==CACHE);
  await Promise.all(previous.map(key=>caches.delete(key)));
  await self.clients.claim();
  if(previous.length){
    const windows=await self.clients.matchAll({type:'window'});
    await Promise.all(windows.filter(client=>client.url.startsWith(self.registration.scope)).map(client=>client.navigate(client.url).catch(()=>{})));
  }
})()));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}
      return response;
    }).catch(()=>caches.match(request).then(cached=>cached||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});
