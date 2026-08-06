import { useEffect, useState } from "react";

// Tracks which of the given section ids currently sits in the vertical middle of the viewport
export function useActiveSection(ids: string[]): string
{
    const [activeId, setActiveId] = useState(ids[0] ?? "");
    const idsKey = ids.join(",");

    useEffect(() =>
    {
        const elements = idsKey
            .split(",")
            .filter(Boolean)
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0)
        {
            return;
        }

        // Choose the section whose midpoint is closest to the viewport centre.
        // Use a requestAnimationFrame-backed scroll/resize listener for smooth updates
        let ticking = false;

        const computeActive = () =>
        {
            try
            {
                const centerY = window.innerHeight / 2;

                let bestId: string | null = null;
                let bestDistance = Infinity;

                for (const el of elements)
                {
                    const rect = el.getBoundingClientRect();
                    const mid = rect.top + rect.height / 2;
                    const distance = Math.abs(mid - centerY);

                    if (distance < bestDistance)
                    {
                        bestDistance = distance;
                        bestId = el.id;
                    }
                }

                if (bestId)
                {
                    setActiveId((prev) => (prev === bestId ? prev : bestId));
                }
            }
            catch
            {
                /* ignore layout/read errors */
            }
        };

        const onScroll = () =>
        {
            if (ticking)
            {
                return;
            }

            ticking = true;

            requestAnimationFrame(() =>
            {
                computeActive();
                ticking = false;
            });
        };

        // compute once immediately
        computeActive();

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () =>
        {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [idsKey]);

    return activeId;
}
