let grammar=null;
let recognition=null;
let speechRecognitionList=null;

export function cancel_listen()
{
    recognition.stop();
    grammar=null;
    recognition=null;
    speechRecognitionList=null;
}

export function listen_for(commands,callback)
{
    if(recognition)
        cancel_listen();

    grammar = '#JSGF V1.0; grammar colors; public <command> = ' + commands.join(' | ') + ' ;'

    recognition = new window.SpeechRecognition();
    speechRecognitionList = new window.SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) =>
    {
        callback(e.results[0][0].transcript,event.results[0][0].confidence);
    }

    recognition.onspeechend = function()  { }

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