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
      console.log("🔐 Sending OTP to:", email);
      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      
      if (!resendApiKey) {
        throw new Error("RESEND_API_KEY environment variable is not set");
      }

      console.log("📧 From:", fromEmail);
      console.log("🔑 API Key exists:", !!resendApiKey);

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          reply_to: email,
          subject: "Your ChatFlow AI Verification Code",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Your Verification Code</h2>
              <p>Use this code to sign in to ChatFlow AI:</p>
              <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #333; margin: 0; font-family: monospace;">${token}</h1>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
              <p style="color: #999; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
          `,
        }),
      });

      console.log("📬 Resend response status:", response.status);

      if (!response.ok) {
        const error = await response.text();
        console.error("❌ Resend error:", error);
        throw new Error(`Resend API error: ${error}`);
      }
      
      console.log("✅ OTP email sent successfully");
    } catch (error) {
      console.error("🚨 Email sending failed:", error);
      throw new Error(
        `Failed to send verification email: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
});