/* Copyright (C) 2020 D8DATAWORKS - All Rights Reserved */

import * as store from './store.js'

export function Update()
{
    navigator.serviceWorker.controller.postMessage("update");
}

export async function IsUpdateAvailable()
{
    let cdb = await store.common.get("pwaversion");
    let ldb = await store.common.get("pwalatest");

    if(!cdb || !ldb)
        return false;
    
    if(cdb.version == ldb.version)
        return false;

    return [cdb,ldb];
}

export function RequestLatestVersion(cdb,cb)
{
    fetch(`version.json?o=${Date.now().toString(16)}`).then((r) =>
    {
        if(r.ok)
            return r.json();
    }).then(async (v) =>
    {
        v.checked=Date.now();
        if (!cdb) await store.common.set('pwaversion',v);
        await store.common.set('pwalatest',v);

        if(cb)cb();
    }).catch(e => 
    {
        if(cb)cb(e);

        console.log("Failed to request latest version data from server",e);
    });
}

store.common.get("pwaversion",(cdb)=>
{
    if(cdb)
    {
        let now = Date.now();
        if(cdb.checked + 24*60*60*1000 > now)
            return;
    }

    RequestLatestVersion(cdb);
});

window.addEventListener('load', async () => 
{
    navigator.serviceWorker.register('pwathread.js')
        .then(() => {

            navigator.serviceWorker.addEventListener('message', e => 
            {
                switch(e.data)
                {
                    case 'cache_cleared':
                        store.common.del('pwaversion');
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