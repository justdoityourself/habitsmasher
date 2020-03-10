/* Copyright (C) 2020 D8DATAWORKS - All Rights Reserved */

export let current_version = "1.0.1";

export function Update()
{
    navigator.serviceWorker.controller.postMessage("update");
}

export function RequestLatestVersionDetails(cb)
{
    var a,q;
    var p = new Promise((_a,_q)=>{a=_a;q=_q;});

    fetch(`version.json?o=${Date.now().toString(16)}`).then((r) =>
    {
        if(r.ok)
            return r.json();
    }).then((v) =>
    {
        if(cb) cb(v);
        a(v)
    }).catch(e => 
    {
        if(cb)cb({version:current_version},e);
        q(e);

        console.log("Failed to request latest version data from server",e);
    });

    return p;
}

window.addEventListener('load', async () => 
{
    navigator.serviceWorker.register('pwathread.js')
        .then(() => {

            navigator.serviceWorker.addEventListener('message', e => 
            {
                switch(e.data)
                {
                    case 'cache_cleared':
                        Update();
                        break;
                    default:
                        console.log("Unknown Message from service worker.");
                        break;
                }
            });
        },
        (err) => console.log('Service Worker registration failed: ', ''+err))
        .catch((err) => console.log("Service Worker Exception", err));
});