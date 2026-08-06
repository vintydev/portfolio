import type { ReactElement } from "react";
import { useContactForm } from "../../hooks/useContactForm";
import styles from "./ContactForm.module.css";

export function ContactForm(): ReactElement
{
    const { name, email, message, status, setName, setEmail, setMessage, handleSubmit } = useContactForm();

    if (status === "success")
    {
        return (
            <p className={styles.success} role="status">
                Thanks &mdash; your message is on its way. I&rsquo;ll get back to you soon.
            </p>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" type="text" value={name} onChange={(event) => setName(event.target.value)} required/>
            </div>

            <div className={styles.field}>
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required/>
            </div>

            <div className={styles.field}>
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" name="message" rows={5} value={message} onChange={(event) => setMessage(event.target.value)} required/>
            </div>

            {status === "error" && (
                <p className={styles.error} role="alert">
                    Something went wrong sending your message. Please try again, or email contact@vinty.dev directly.
                </p>
            )}

            <button type="submit" className={styles.submit} disabled={status === "submitting"}>
                {status === "submitting" ? "Sending…" : "Send message"}
            </button>
        </form>
    );
}
