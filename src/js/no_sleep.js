export function enter_no_sleep()
{
    try
    {
        navigator.wakeLock.request("display");
    }
    catch(e)
    {
        if(e);
    }
}

export function leave_no_sleep()
{   
    try
    {
        navigator.wakeLock.release("display");
    }
    catch(e)
    {
        if(e);
    }
}

