import sgMail from '@sendgrid/mail';
import { config } from '../config/environment';

// Make SendGrid optional - only initialize if API key is available
if (config.email.apiKey && config.email.apiKey !== 'your_sendgrid_api_key') {
  sgMail.setApiKey(config.email.apiKey);
  console.log('✉️ SendGrid initialized');
} else {
  console.log('⚠️ SendGrid API key not configured - emails will be logged instead');
}

// Base email sending function
export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  const msg = {
    to,
    from: config.email.from,
    subject,
    text,
    html: html || text,
  };

  try {
    // If SendGrid is not configured, just log the email instead
    if (!config.email.apiKey || config.email.apiKey === 'your_sendgrid_api_key') {
      console.log(`📧 [EMAIL SIMULATION] To: ${to}, Subject: ${subject}`);
      console.log(`Content: ${text}`);
      return;
    }
    
    await sgMail.send(msg);
    console.log(`✉️ Email sent to ${to}`);
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email: string, firstName: string) => {
  const subject = 'Welcome to DKHOUL! 🎉';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌟 Welcome to DKHOUL!</h1>
        </div>
        <div class="content">
          <h2>Hello ${firstName}!</h2>
          <p>Thank you for joining DKHOUL - Morocco's premier marketplace for unique experiences and services!</p>
          <p>We're excited to have you as part of our community. Whether you're looking to discover amazing services or offer your own, DKHOUL is here to connect you with the best.</p>
          <p><strong>What's next?</strong></p>
          <ul>
            <li>Complete your profile to get started</li>
            <li>Browse our curated selection of services</li>
            <li>List your own services if you're a provider</li>
            <li>Connect with trusted professionals</li>
          </ul>
          <a href="${config.frontendUrl}/dashboard" class="button">Visit Your Dashboard</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} DKHOUL. All rights reserved.</p>
          <p>Morocco's #1 Marketplace</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, `Welcome ${firstName}!`, html);
};

// Send email verification
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${config.frontendUrl}/verify-email/${token}`;
  const subject = 'Verify Your DKHOUL Account ✅';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #48bb78; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Verify Your Email</h1>
        </div>
        <div class="content">
          <h2>Email Verification Required</h2>
          <p>Thank you for registering with DKHOUL! Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          <div class="warning">
            <strong>⏰ This link will expire in 24 hours.</strong>
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, `Verify your email: ${verificationUrl}`, html);
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, token: string) => {
  // Point to the correct frontend route nested under /auth
  const resetUrl = `${config.frontendUrl}/auth/reset-password/${token}`;
  const subject = 'Reset Your DKHOUL Password 🔒';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f56565; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #f56565; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .warning { background: #fee; border-left: 4px solid #f56565; padding: 15px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>We received a request to reset your DKHOUL account password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <div class="warning">
            <strong>⏰ This link will expire in 1 hour.</strong>
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, `Reset your password: ${resetUrl}`, html);
};

// Send booking confirmation
export const sendBookingConfirmation = async (
  email: string,
  bookingDetails: {
    userName: string;
    serviceTitle: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    bookingId: string;
  }
) => {
  const subject = 'Booking Confirmation - DKHOUL 🎉';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #48bb78; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hello ${bookingDetails.userName}!</h2>
          <p>Your booking has been confirmed. Here are the details:</p>
          <div class="booking-details">
            <h3>${bookingDetails.serviceTitle}</h3>
            <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
            <p><strong>Check-in:</strong> ${bookingDetails.startDate}</p>
            <p><strong>Check-out:</strong> ${bookingDetails.endDate}</p>
            <p><strong>Total Amount:</strong> ${bookingDetails.totalAmount} MAD</p>
          </div>
          <a href="${config.frontendUrl}/bookings/${bookingDetails.bookingId}" class="button">View Booking Details</a>
          <p style="margin-top: 30px;">We hope you have a wonderful experience!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, 'Your booking is confirmed!', html);
};

// Send payment receipt
export const sendPaymentReceipt = async (
  email: string,
  paymentDetails: {
    userName: string;
    amount: number;
    transactionId: string;
    date: string;
    serviceTitle: string;
  }
) => {
  const subject = 'Payment Receipt - DKHOUL 💳';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💳 Payment Receipt</h1>
        </div>
        <div class="content">
          <h2>Hello ${paymentDetails.userName}!</h2>
          <p>Thank you for your payment. Here's your receipt:</p>
          <div class="receipt">
            <h3>Payment Details</h3>
            <p><strong>Service:</strong> ${paymentDetails.serviceTitle}</p>
            <p><strong>Amount Paid:</strong> ${paymentDetails.amount} MAD</p>
            <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
            <p><strong>Date:</strong> ${paymentDetails.date}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, 'Your payment receipt', html);
};

