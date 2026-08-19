import { useState, useEffect, useCallback } from "react";

interface IUseContainerSizeResult
{
    containerRef: (node: HTMLDivElement | null) => void;
    element: HTMLDivElement | null;
    width: number;
    height: number;
}

// Measures the size of a container element and returns its width and height, updating whenever the size changes
export function useContainerSize(): IUseContainerSizeResult
{
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    // Memoize the ref callback to avoid unnecessary re-renders
    const containerRef = useCallback((node: HTMLDivElement | null) =>
    {
        setElement(node);
    }, []);

    useEffect(() =>
    {
        if (!element)
        {
            return;
        }

        const observer = new ResizeObserver((entries) =>
        {
            const { width, height } = entries[0].contentRect;
            setWidth(width);
            setHeight(height);
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [element]);

    return { containerRef, element, width, height };
}
