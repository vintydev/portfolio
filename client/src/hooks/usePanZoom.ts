import { useEffect, useRef, useState } from "react";

interface IUsePanZoomOptions
{
    element: HTMLDivElement | null;
    zoomBy: (delta: number) => void;
}

interface IPanStart
{
    mouseX: number;
    mouseY: number;
    scrollLeft: number;
    scrollTop: number;
}

// Define constants for zoom sensitivity for both wheel and pinch gestures
const WHEEL_ZOOM_SENSITIVITY = 0.0015;
const PINCH_ZOOM_SENSITIVITY = 0.01;

// GetTouchDistance calculates the distance between two touch points
// used for pinch-to-zoom gestures
function GetTouchDistance(touches: TouchList): number
{
    const [first, second] = [touches[0], touches[1]];
    return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
}

// usePanZoom is a custom React hook that enables panning and zooming on a given HTMLDivElement
export function usePanZoom({ element, zoomBy }: IUsePanZoomOptions): boolean
{
    const [isPanning, setIsPanning] = useState<boolean>(false);
    const panStart = useRef<IPanStart | null>(null);
    const pinchDistance = useRef<number | null>(null);

    useEffect(() =>
    {
        if (!element)
        {
            return;
        }

        function HandleWheel(event: WheelEvent): void
        {
            if (!event.ctrlKey && !event.metaKey)
            {
                return;
            }

            event.preventDefault();
            zoomBy(-event.deltaY * WHEEL_ZOOM_SENSITIVITY);
        }

        element.addEventListener("wheel", HandleWheel, { passive: false });
        return () => element.removeEventListener("wheel", HandleWheel);
    }, [element, zoomBy]);

    useEffect(() =>
    {
        if (!element)
        {
            return;
        }

        const node = element;

        function HandleMouseDown(event: MouseEvent): void
        {
            event.preventDefault();
            panStart.current = {
                mouseX: event.clientX,
                mouseY: event.clientY,
                scrollLeft: node.scrollLeft,
                scrollTop: node.scrollTop
            };
            setIsPanning(true);
        }

        function HandleMouseMove(event: MouseEvent): void
        {
            if (!panStart.current)
            {
                return;
            }

            node.scrollLeft = panStart.current.scrollLeft - (event.clientX - panStart.current.mouseX);
            node.scrollTop = panStart.current.scrollTop - (event.clientY - panStart.current.mouseY);
        }

        function HandleMouseUp(): void
        {
            panStart.current = null;
            setIsPanning(false);
        }

        node.addEventListener("mousedown", HandleMouseDown);
        window.addEventListener("mousemove", HandleMouseMove);
        window.addEventListener("mouseup", HandleMouseUp);

        return () =>
        {
            node.removeEventListener("mousedown", HandleMouseDown);
            window.removeEventListener("mousemove", HandleMouseMove);
            window.removeEventListener("mouseup", HandleMouseUp);
        };
    }, [element]);

    useEffect(() =>
    {
        if (!element)
        {
            return;
        }

        function HandleTouchStart(event: TouchEvent): void
        {
            if (event.touches.length === 2)
            {
                event.preventDefault();
                pinchDistance.current = GetTouchDistance(event.touches);
            }
        }

        function HandleTouchMove(event: TouchEvent): void
        {
            if (event.touches.length !== 2 || pinchDistance.current === null)
            {
                return;
            }

            event.preventDefault();
            const distance = GetTouchDistance(event.touches);
            zoomBy((distance - pinchDistance.current) * PINCH_ZOOM_SENSITIVITY);
            pinchDistance.current = distance;
        }

        function HandleTouchEnd(event: TouchEvent): void
        {
            if (event.touches.length < 2)
            {
                pinchDistance.current = null;
            }
        }

        element.addEventListener("touchstart", HandleTouchStart, { passive: false });
        element.addEventListener("touchmove", HandleTouchMove, { passive: false });
        element.addEventListener("touchend", HandleTouchEnd);
        element.addEventListener("touchcancel", HandleTouchEnd);

        return () =>
        {
            element.removeEventListener("touchstart", HandleTouchStart);
            element.removeEventListener("touchmove", HandleTouchMove);
            element.removeEventListener("touchend", HandleTouchEnd);
            element.removeEventListener("touchcancel", HandleTouchEnd);
        };
    }, [element, zoomBy]);

    return isPanning;
}
