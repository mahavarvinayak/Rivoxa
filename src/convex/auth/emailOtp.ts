import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  // This function can be asynchronous
  generateVerificationToken() {
    return generateRandomString(6, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      
      if (!resendApiKey) {
        throw new Error("RESEND_API_KEY environment variable is not set");
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: email,
          subject: "Your ChatFlow AI Verification Code",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Your Verification Code</h2>
              <p>Use this code to sign in to ChatFlow AI:</p>
              <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="font-size: 32px; letter-spacing: 5px; color: #333; margin: 0;">${token}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
              <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Resend API error: ${error}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to send verification email: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
});