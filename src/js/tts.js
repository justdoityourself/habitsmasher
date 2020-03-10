/* Copyright (C) 2020 D8DATAWORKS - All Rights Reserved */

//import * as o from './debug.js'

let o = 
{
    error(msg) { console.log(msg); },
}

let pending=[];

export function Initialize()
{
    //let start = Date.now();
    //o.trace("Config Voices");

    function FetchVoices()
    {
        /*var voices = */speechSynthesis.getVoices();
    }

    try
    {
        FetchVoices();
    }
    catch(e)
    {
        o.error("Failed to configure voices " + e);
    }

    //o.trace(`Config Voices Finished in ${o.do_time("MusicDB",start)}ms`);
}

export async function Speak(t,v)
{
    await SpeakText(t,undefined,v/100);
}



export function StopSpeaking()
{
    window.speechSynthesis.cancel();
    for(let i = 0; i < pending.length; i++)
        pending[i]();
    pending = [];
}

export function SpeakText(text,r,v)
{
    let a,q,p = new Promise((_a,_q)=>{a=_a;q=_q;});
    pending.push(a);
    r = r || 1;
    v = v || 1;

    //Protect Against Chrome 300 character limit.
    let list = text.split('.').join(',').split(',');

    for(let i = 0; i < list.length; i++)
    {
        //if there is no share and 300 characters without a period then that is their problem
        if(list[i].length > 250) 
            list[i] = list[i].substring(0,250)
    }

    let c = 0;
    for (let i = 0; i< list.length; i++)
    {
        var h = new SpeechSynthesisUtterance(list[i]);
        h.rate = r;
        h.volume = v;
        h.voice = speechSynthesis.getVoices().filter(function(voice) {return voice.name == "Google UK English Female"})[0];
        h.onerror = (e)=> 
        {
            q(e);
        };
        h.onend = (e)=>
        {
            if(++c==list.length)
            {
                pending.shift();
                a(e);
            }
        }

        window.speechSynthesis.speak(h);
    }

    return p;
}