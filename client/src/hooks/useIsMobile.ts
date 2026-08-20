import { useState, useEffect } from "react";

const MOBILE_QUERY = "(max-width: 640px), (pointer: coarse)";


// Find if this device is a mobile device based on the screen width and pointer type
export function useIsMobile(): boolean
{
    const [isMobile, setIsMobile] = useState<boolean>(() => window.matchMedia(MOBILE_QUERY).matches);

    useEffect(() => 
    {
        const mql = window.matchMedia(MOBILE_QUERY);
        function HandleChange(event: MediaQueryListEvent): void
        {
            setIsMobile(event.matches);
        }

        mql.addEventListener("change", HandleChange);

        return () => mql.removeEventListener("change", HandleChange);

    }, []);


    return isMobile;
}