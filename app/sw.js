const CACHE='r2s-prototype-v3';
const CORE=['./','./index.html','./app.css','./app.js','./manifest.webmanifest','./offline.html','../assets/r2s-emblem.png','../assets/icon-192.png','../assets/icon-512.png','../assets/navigator-art.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./offline.html'))));});
