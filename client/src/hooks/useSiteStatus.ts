import { useEffect, useState } from "react";
import { getSiteStatus } from "../api/siteStatus";

// Decorative status flags: fail silently to "off" rather than surfacing an error to the visitor
export function useSiteStatus(): boolean
{
    const [isLookingForWork, setIsLookingForWork] = useState(false);

    useEffect(() =>
    {
        const controller = new AbortController();

        getSiteStatus(controller.signal)
            .then((status) => setIsLookingForWork(status.isLookingForWork))
            .catch(() => {});

        return () => controller.abort();
    }, []);

    return isLookingForWork;
}
