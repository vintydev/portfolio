import { apiGet } from "./client";
import type { IExperience } from "../types/Experience";

export function getExperience(signal?: AbortSignal): Promise<IExperience[]>
{
    return apiGet<IExperience[]>("/api/experience", signal);
}
