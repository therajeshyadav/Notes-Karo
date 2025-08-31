import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  try {
    const result = await transporter.sendMail({
      from: `"NoteKaro" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code - NoteKaro",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a73e8;">NoteKaro - Email Verification</h2>
          <p>Your OTP code is:</p>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #1a73e8; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
          </div>
          <p>This code is valid for 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    });

    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error: any) {
    console.error('Email sending failed:', error);
    
    // Check for specific email delivery errors
    if (error.code === 'ENOTFOUND' || 
        error.message.includes('domain') || 
        error.message.includes('couldn\'t be found') ||
        error.message.includes('No MX record') ||
        error.responseCode === 550 ||
        error.response?.includes('User unknown') ||
        error.response?.includes('Recipient address rejected')) {
      throw new Error('EMAIL_NOT_FOUND');
    }
    
    // Re-throw the original error for other cases
    throw error;
  }
}
