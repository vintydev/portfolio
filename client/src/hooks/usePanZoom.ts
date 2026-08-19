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

const WHEEL_ZOOM_SENSITIVITY = 0.0015;

// Wires ctrl/cmd + scroll-to-zoom and click-and-drag panning onto a native overflow:auto element. Drag panning
// works by setting scrollLeft/scrollTop directly, so the browser clamps it to the content's real bounds for
// free — no manual bounds math needed. Plain wheel/trackpad scroll is left entirely to native scrolling.
export function usePanZoom({ element, zoomBy }: IUsePanZoomOptions): boolean
{
    const [isPanning, setIsPanning] = useState<boolean>(false);
    const panStart = useRef<IPanStart | null>(null);

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

    return isPanning;
}
