import { useEffect, useState } from "react";
import { getExperience } from "../api/experience";
import type { IExperience } from "../types/Experience";

interface IUseExperienceResult
{
    experience: IExperience[];
    isLoading: boolean;
    error: string | null;
}

export function useExperience(): IUseExperienceResult
{
    const [experience, setExperience] = useState<IExperience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>
    {
        const controller = new AbortController();

        async function load(): Promise<void>
        {
            try
            {
                const data = await getExperience(controller.signal);
                setExperience(data);
            }
            catch
            {
                if (!controller.signal.aborted)
                {
                    setError("Unable to load experience.");
                }
            }
            finally
            {
                if (!controller.signal.aborted)
                {
                    setIsLoading(false);
                }
            }
        }

        load();

        return () => controller.abort();
    }, []);

    return { experience, isLoading, error };
}
