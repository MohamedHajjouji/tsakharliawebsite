'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
  type: 'contact' | 'delivery' | 'partner';
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  // Additional fields for delivery workers
  city?: string;
  vehicleType?: string;
  availability?: string;
  experience?: string;
  whyJoin?: string;
  // Additional fields for partners
  storeName?: string;
  ownerName?: string;
  address?: string;
  category?: string;
  size?: string;
  revenue?: string;
}

export async function sendFormEmail(data: ContactFormData) {
  const { type, ...formData } = data;
  
  // Validate required fields
  if (!formData.name || !formData.email) {
    return { success: false, error: 'Name and email are required' };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { success: false, error: 'Invalid email format' };
  }

  try {
    // Determine subject and recipient based on form type
    let subject = '';
    let htmlContent = '';

    switch (type) {
      case 'delivery':
        subject = `New Delivery Worker Application - ${formData.name}`;
        htmlContent = `
          <h2>New Delivery Worker Application</h2>
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
            <p><strong>City:</strong> ${formData.city || 'N/A'}</p>
            <p><strong>Vehicle Type:</strong> ${formData.vehicleType || 'N/A'}</p>
            <p><strong>Availability:</strong> ${formData.availability || 'N/A'}</p>
            <p><strong>Experience:</strong> ${formData.experience || 'N/A'}</p>
            <p><strong>Why Join:</strong> ${formData.whyJoin || 'N/A'}</p>
          </div>
        `;
        break;

      case 'partner':
        subject = `New Partner Application - ${formData.storeName || formData.name}`;
        htmlContent = `
          <h2>New Partner Application</h2>
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p><strong>Store Name:</strong> ${formData.storeName || 'N/A'}</p>
            <p><strong>Owner/Manager:</strong> ${formData.ownerName || formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
            <p><strong>Address:</strong> ${formData.address || 'N/A'}</p>
            <p><strong>City:</strong> ${formData.city || 'N/A'}</p>
            <p><strong>Category:</strong> ${formData.category || 'N/A'}</p>
            <p><strong>Size:</strong> ${formData.size || 'N/A'}</p>
            <p><strong>Revenue:</strong> ${formData.revenue || 'N/A'}</p>
            <p><strong>Why Join:</strong> ${formData.whyJoin || 'N/A'}</p>
          </div>
        `;
        break;

      case 'contact':
      default:
        subject = `Contact Form: ${formData.subject || 'General Inquiry'}`;
        htmlContent = `
          <h2>New Contact Form Submission</h2>
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Subject:</strong> ${formData.subject || 'General Inquiry'}</p>
            <p><strong>Message:</strong></p>
            <p>${formData.message}</p>
          </div>
        `;
        break;
    }

    // Send email to Tsakhar Lia team
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.RESEND_VERIFIED_DOMAIN 
        ? `Tsakhar Lia Website <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`
        : 'Tsakhar Lia Website',
      to: ['contact@tsakharlia.com'],
      subject: subject,
      html: htmlContent,
      replyTo: formData.email,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error: 'Failed to send email' };
    }

    // Send confirmation email to user
    const confirmationSubject = 'Thank you for contacting Tsakhar Lia!';
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #D02828; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Tsakhar Lia</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Thank you, ${formData.name}!</h2>
          <p>We've received your ${type === 'delivery' ? 'delivery worker application' : type === 'partner' ? 'partner application' : 'message'} and will get back to you soon.</p>
          
          ${type === 'delivery' ? `
            <h3>What's Next?</h3>
            <p>Our team will review your application and contact you within 2-3 business days to discuss the next steps.</p>
          ` : type === 'partner' ? `
            <h3>What's Next?</h3>
            <p>Our partnership team will review your application and reach out to discuss how we can work together.</p>
          ` : `
            <h3>What's Next?</h3>
            <p>Our support team will respond to your inquiry within 24 hours.</p>
          `}

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Summary:</strong></p>
            <p>${type === 'delivery' ? `Application for: Delivery Worker` : type === 'partner' ? `Store: ${formData.storeName}` : `Subject: ${formData.subject}`}</p>
          </div>

          <p style="color: #666; font-size: 14px;">
            If you have any urgent questions, please contact us at <a href="mailto:contact@tsakharlia.com">contact@tsakharlia.com</a>
          </p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>Tsakhar Lia - Ultra-Fast Moroccan Delivery Service</p>
          <p>Available until 1 AM daily</p>
        </div>
      </div>
    `;

    // Send confirmation email to user
    await resend.emails.send({
      from: process.env.RESEND_VERIFIED_DOMAIN 
        ? `Tsakhar Lia <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`
        : 'Tsakhar Lia',
      to: [formData.email],
      subject: confirmationSubject,
      html: confirmationHtml,
    });

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}