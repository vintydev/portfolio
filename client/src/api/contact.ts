import { apiPost } from "./client";
import type { IContactRequest } from "../types/Contact";

export function postContact(request: IContactRequest, signal?: AbortSignal): Promise<void>
{
    return apiPost<IContactRequest>("/api/contact", request, signal);
}
