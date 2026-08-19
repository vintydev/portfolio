import { useState } from "react";
import { clamp } from "../utils/clamp";

interface IUseZoomOptions
{
    step?: number;
    min?: number;
    max?: number;
}

interface IUseZoomResult
{
    zoom: number;
    canZoomIn: boolean;
    canZoomOut: boolean;
    zoomIn: () => void;
    zoomOut: () => void;
    zoomBy: (delta: number) => void;
    reset: () => void;
}

export function useZoom(options?: IUseZoomOptions): IUseZoomResult
{
    const step = options?.step ?? 0.25;
    const min = options?.min ?? 0.5;
    const max = options?.max ?? 2.5;

    const [zoom, setZoom] = useState<number>(1);

    function zoomBy(delta: number): void
    {
        setZoom((prev) => clamp(prev + delta, min, max));
    }

    function zoomIn(): void
    {
        zoomBy(step);
    }

    function zoomOut(): void
    {
        zoomBy(-step);
    }

    function reset(): void
    {
        setZoom(1);
    }

    return {
        zoom,
        canZoomIn: zoom < max,
        canZoomOut: zoom > min,
        zoomIn,
        zoomOut,
        zoomBy,
        reset
    };
}
