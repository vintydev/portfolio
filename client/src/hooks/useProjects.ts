import { useEffect, useState } from "react";
import { getProjects } from "../api/projects";
import type { IProject } from "../types/Project";

interface IUseProjectsResult
{
    projects: IProject[];
    isLoading: boolean;
    error: string | null;
}

export function useProjects(): IUseProjectsResult
{
    const [projects, setProjects] = useState<IProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>
    {
        const controller = new AbortController();

        async function load(): Promise<void>
        {
            try
            {
                const data = await getProjects(controller.signal);
                setProjects(data);
            }
            catch
            {
                if (!controller.signal.aborted)
                {
                    setError("Unable to load projects.");
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

    return { projects, isLoading, error };
}
