import { useState, useRef, useEffect } from "react";


const SCROLL_IDLE_DELAY= 400;

// Create a hook to track whether the user is currently scrolling within a given element
export function useIsScrolling(element: HTMLDivElement | null): boolean
{
    const [isScrolling, setIsScrolling] = useState<boolean>(false);
    const timeoutRef = useRef<number | undefined>(undefined);

    useEffect(() =>
    {
        if (!element)
        {
            return;
        }

        function HandleScroll(): void
        {
            setIsScrolling(true);
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = window.setTimeout(() =>
            {
                setIsScrolling(false);
            }, SCROLL_IDLE_DELAY);
        }

        element.addEventListener("scroll", HandleScroll);

        return () =>
        {
            element.removeEventListener("scroll", HandleScroll);
        }
    }, [element]);

    return isScrolling;

}