'use server';

import { Resend } from 'resend';

export type ContactState = {
    ok: boolean;
    error?: string;
};

export async function sendContactForm(
    _prevState: ContactState,
    formData: FormData
): Promise<ContactState> {
    if (!process.env.RESEND_API_KEY) {
        return { ok: false, error: 'Missing RESEND_API_KEY environment variable.' };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const service = formData.get('service') as string;
    const message = formData.get('message') as string;

    const { error } = await resend.emails.send({
        from: 'Handy Sam <onboarding@resend.dev>',
        to: ['samuel.barone+handysam@gmail.com'], // TODO: replace with your real email address
        subject: `New contact form submission from ${name}`,
        replyTo: email,
        text: `
            New contact form submission:

            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Service: ${service}

            Message:
            ${message}
        `,
        html: `
            <h3>New contact form submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Message:</strong> ${message}</p>
        `,
    });

    if (error) {
        console.error('Resend error:', error);
        return { ok: false, error: `Failed to send email: ${error.message}` };
    }

    return { ok: true };
}
