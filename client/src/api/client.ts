const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error
{
    status: number;

    constructor(message: string, status: number)
    {
        super(message);
        this.status = status;
    }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T>
{
    const response = await fetch(`${API_BASE_URL}${path}`, { signal });

    if (!response.ok)
    {
        throw new ApiError(`Request to ${path} failed`, response.status);
    }

    return response.json() as Promise<T>;
}

export async function apiPost<TRequest>(path: string, body: TRequest, signal?: AbortSignal): Promise<void>
{
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal
    });

    if (!response.ok)
    {
        throw new ApiError(`Request to ${path} failed`, response.status);
    }
}
