/* Copyright (C) 2020 D8DATAWORKS - All Rights Reserved */

self.addEventListener('install', function(event) 
{
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) 
{
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', async (e) =>
{
    switch(e.data)
    {
    case 'update':
        caches.delete("main").then(()=>
        {
            clients.matchAll().then((clients)=>
            {
                clients.forEach((client) => {
                    client.postMessage("cache_cleared");
                });
            });
        });
        break;
    default:
        console.log("ServiceWorker received unknown command",e.data)
    }
});

self.addEventListener("fetch", function (event) 
{ 
    if(event.request.url.indexOf('/version.js')!=-1||event.request.url.indexOf('/manifest.js')!=-1)
    {
        event.respondWith(
            fetch(event.request)
              .then(function (response) 
              {
                event.waitUntil(updateCache(event.request, response.clone()));

                return response;
              })
              .catch(function (error) {
                return fromCache(event.request);
              })
          );
        return;
    }

  if (event.request.method !== "GET") return;

  event.respondWith(
    fromCache(event.request).then(
      function (response) {
        event.waitUntil(
          fetch(event.request).then(function (response) {
            return updateCache(event.request, response);
          })
        );

        return response;
      },
      function () {
        return fetch(event.request)
          .then(function (response) {
            event.waitUntil(updateCache(event.request, response.clone()));

            return response;
          })
          .catch(function (error) {
            console.log("Network request failed and no cache." + error);
          });
      }
    )
  );
});

function fromCache(request) {
  return caches.open('main').then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open('main').then(function (cache) {
    return cache.put(request, response);
  });
}
