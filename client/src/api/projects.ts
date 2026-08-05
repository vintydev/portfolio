import { apiGet } from "./client";
import type { IProject } from "../types/Project";

export function getProjects(signal?: AbortSignal): Promise<IProject[]>
{
    return apiGet<IProject[]>("/api/projects", signal);
}

export function getProject(id: number, signal?: AbortSignal): Promise<IProject>
{
    return apiGet<IProject>(`/api/projects/${id}`, signal);
}
