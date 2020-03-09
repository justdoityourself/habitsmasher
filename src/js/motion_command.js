let accelerometer = null;

export function stop_motion_polling()
{
    accelerometer.stop();
    accelerometer = null;
}

export function start_motion_polling(callback,freq)
{
    if(!freq)
        freq=10;

    if(accelerometer)
        stop_motion_polling();

    accelerometer = new window.Accelerometer({frequency: freq});

    accelerometer.addEventListener('reading', () => 
    {
        if(accelerometer.x || accelerometer.y || accelerometer.z)
            callback();
    });

    accelerometer.start();
}

