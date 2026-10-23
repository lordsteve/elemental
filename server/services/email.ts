import nodemailer, { Transporter } from 'nodemailer';

if (!process.env.EMAIL_USER) require('dotenv').config();

let transporter: Transporter | null = null;

/**
 * Sends email through the account in EMAIL_USER/EMAIL_PASS (Gmail unless
 * EMAIL_SERVICE says otherwise). Optional, like the database: without
 * those, isConfigured is false and nothing is sent.
 */
export default class EmailService {
    static get isConfigured(): boolean {
        return !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS;
    }

    /** Resolves to the send result, or undefined if it couldn't be sent. */
    static async sendEmail(to: string, subject: string, text: string, html?: string, replyTo?: string) {
        if (!this.isConfigured) {
            console.error('Email not sent: EMAIL_USER and EMAIL_PASS must be set');
            return undefined;
        }
        transporter ??= nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        try {
            return await transporter.sendMail({
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                replyTo,
                to,
                subject,
                text,
                html,
            });
        } catch (error) {
            console.error('Error sending email:', error);
            return undefined;
        }
    }
}
