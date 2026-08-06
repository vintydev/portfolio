import type { SubmitEvent } from "react";
import { useState } from "react";
import { postContact } from "../api/contact";

type tSubmitStatus = "idle" | "submitting" | "success" | "error";

interface IUseContactFormResult
{
    name: string;
    email: string;
    message: string;
    status: tSubmitStatus;
    setName: (value: string) => void;
    setEmail: (value: string) => void;
    setMessage: (value: string) => void;
    handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
}

export function useContactForm(): IUseContactFormResult
{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<tSubmitStatus>("idle");

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void>
    {
        event.preventDefault();
        setStatus("submitting");

        try
        {
            await postContact({ name, email, message });
            setStatus("success");
        }
        catch
        {
            setStatus("error");
        }
    }

    return { name, email, message, status, setName, setEmail, setMessage, handleSubmit };
}
