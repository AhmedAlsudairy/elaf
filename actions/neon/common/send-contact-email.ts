'use server'

import { sendEmail } from "@/lib/utils/resend/send-emails";


interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactForm(formData: ContactFormData) {
  try {
    const result = await sendEmail({
      to: ['contact@elaaaf.com'],
      title: 'New Contact Form Submission',
      body: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      `
    });

    if (result.success) {
      return { success: true, message: result.message };
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to send contact form:', error);
    return { success: false, error: 'Failed to send message' };
  }
}