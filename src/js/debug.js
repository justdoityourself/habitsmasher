export let debug = true;
export let timings = {};
export let usage_count = 0;
export let activity = 0;
export let usage = {}

window.addEventListener('error', function (evt) 
{
    console.log("Caught[via 'error' event]:  '" + evt.message + "' from " + evt.filename + ":" + evt.lineno);
    console.log(evt);
    evt.preventDefault();
});

export function config_debug(d)
{
    debug = d;
}

export function trace(m)
{
    if(!debug)
        return;

    console.log(m);
}

export function error(m)
{
    console.log(m);
}

export function device_capabilities()
{
    if(window.MediaRecorder)
    {
        trace("Using MREC");
        var types = [   "video/webm",
                        "video/mp4",
                        "audio/mp3",
                        "video/webm;codecs=vp8",
                        "video/webm;codecs=vp9",
                        "video/webm;codecs=vp8.0",
                        "video/webm;codecs=vp9.0",
                        "video/webm;codecs=h264",
                        "video/webm;codecs=H264",
                        "video/webm;codecs=avc1",
                        "video/webm;codecs=vp8,opus",
                        "video/WEBM;codecs=VP8,OPUS",
                        "video/webm;codecs=vp9,opus",
                        "video/webm;codecs=vp8,vp9,opus",
                        "video/webm;codecs=h264,opus",
                        "video/webm;codecs=h264,vp9,opus",
                        "video/x-matroska;codecs=avc1",
                        'audio/ogg; codecs=opus',
                        "audio/webm",
                        "audio/webm;codecs=opus"];

        for (var i in types)
            trace( types[i] + " Available? " + (MediaRecorder.isTypeSupported(types[i]) ? "Yes" : "No")); 

        trace("primary host: " + window.servers.primary);
    }
    else
        trace("Using BackupRec");

    if(navigator.mediaDevices && navigator.mediaDevices.getSupportedConstraints)
    {
        let cl = navigator.mediaDevices.getSupportedConstraints();

        trace("Device Constraints:");

        for(let c in cl)
        {
            if (!cl.hasOwnProperty(c))
                continue;

            trace(c);
        }
    }

    trace("UA: " + navigator.userAgent);
}

export function hook_console()
{
    window._loghistory = [];
    var console = window.console,
        _log = console ? console.log : function(){},
        _error = console ? console.error : function(){};

    /*function getErrorObject(){
        try { throw Error('') } catch(err) { return err; }
    }*/

    console.error = function( )
    {
        //let e = getErrorObject();
        //o.history.push("Error",JSON.stringify(e.stack));

        window._loghistory.push.apply( window._loghistory, arguments );
        _error.apply( console, arguments );
    }

    console.log = function( )
    {
        //let e = getErrorObject();
        //o.history.push("Log",JSON.stringify(e.stack));

        window._loghistory.push.apply( window._loghistory, arguments );
        _log.apply( console, arguments );

        //if(e) _log.apply( console, ["error object",e.stack] );
    }
}

export function use(n)
{
    usage_count++;
    activity++;
    trace("Use: " + n);
    if(!usage[n]) usage[n] = 1;
    else usage[n]++;
}

export function do_time(n,s)
{
    let t = Date.now()-s;

    if(!debug)
        return t;

    if(!timings[n]) timings[n] = {total:0,count:0,avg:0};

    timings[n].total+=t;
    timings[n].count++;
    timings[n].avg=timings[n].total-timings[n].count;

    return t;
}

export let do_error_report = async(cmd) =>
{
    let start = Date.now();
    that.trace("Start Error Report"); 

    if(!cmd) cmd = 'error_report';

    try
    {
        let device = (astore) ? (await astore.get('identity')).device : "eol";  
        let contents = "" + window._loghistory;
        contents = contents.split(',').join('\n');
        window._loghistory = [];

        let timings = that.timings;
        let usage = that.usage;
        that.usage = {};
        let performance = store.nstore.performance_report();
        let performance2 = (account.current) ? account.current.performance_report() : "";

        let r = await server.fetchp({
            version:that.current_version,
            cmd,
            device,
            comment:that.report_comment,
            contents,
            timings,
            usage,
            platform:window.platform,
            performance,
            performance2,
            config:
            {
                microphones:that.microphones,
                speakers:that.speakers,
                cameras:that.cameras
            },
            settings:that.configuration,
            time:Date.now()
        })

        if(!r.s)
            console.log("Error Report Failed ( Code 2 )",r.r)
        else
        {
            that.report_comment = "";
        }

        if(cmd=='error_report') that.info("Sent Report.");
    }
    catch(e)
    {
        console.log("Error Report Failed ( Code 1 )",e);
    }

    that.trace(`Error Report Finished in ${debug.do_time("Error Report",start)}ms`);
};

export let report_usage = () => 
{
    if(that.server.accepted && o.usage_count)
    {
        o.usage_count = 0;
        do_error_report("utilization");
    }
};