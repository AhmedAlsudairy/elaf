import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string[];
  title: string;
  body: string;
}

export async function sendEmail({ to, title, body }: EmailParams): Promise<{ success: boolean; message: string }> {
  try {
    const data = await resend.emails.send({
      from: '"Elaf" <noreply@elaaaf.com>',
      to: to,
      subject: title,
      html: `<p>${body}</p>`
    });

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
}