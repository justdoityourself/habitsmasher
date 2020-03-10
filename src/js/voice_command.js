/* Copyright (C) 2020 D8DATAWORKS - All Rights Reserved */

let grammar=null;
let recognition=null;
let speechRecognitionList=null;

export function cancel_listen()
{
    grammar=null;
    speechRecognitionList=null;

    recognition.stop();
    recognition=null;
}

export function listen_for(commands,callback)
{
    if(recognition)
        cancel_listen();

    grammar = '#JSGF V1.0; grammar colors; public <command> = ' + commands.join(' | ') + ' ;'

    recognition = new window.webkitSpeechRecognition();
    speechRecognitionList = new window.webkitSpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) =>
    {
        let i = e.resultIndex;
        let r = event.results[i][0];
        callback(r.transcript.trim(),r.confidence);
    }

    recognition.onend = recognition.onspeechend = function()  
    { 
        if(grammar) 
        {
            try
            {
                recognition.start(); 
            }
            catch(e){ if(e); }
        }
    }

    recognition.onnomatch = () =>
    {
        callback("?",0);
    }

    recognition.onerror = function() 
    {
        callback("",0);
    }

    recognition.start();
}