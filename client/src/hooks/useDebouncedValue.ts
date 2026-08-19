import { useState, useEffect } from "react";

// Returns a debounced version of the given value that only updates after the specified 
// delay has passed without any changes to the value
export function useDebouncedValue<T>(value: T, delay: number): T
{
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() =>
    {
        const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
        return () => window.clearTimeout(timeoutId);
    }, [value, delay]);

    return debouncedValue;
}
