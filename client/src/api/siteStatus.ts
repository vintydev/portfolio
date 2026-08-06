import { apiGet } from "./client";
import type { ISiteStatus } from "../types/SiteStatus";

export function getSiteStatus(signal?: AbortSignal): Promise<ISiteStatus>
{
    return apiGet<ISiteStatus>("/api/sitestatus", signal);
}
