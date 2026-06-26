import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { Resend } from "resend";

const client = new MongoClient(process.env.DB_URL);
const db = client.db("fitNexus");
const resend = new Resend(process.env.RESEND_API_KEY);
const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

const trustedOrigins = [
  baseURL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.BETTER_AUTH_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

export const auth = betterAuth({
  baseURL,
  trustedOrigins,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }, request) => {
      await resend.emails.send({
        from: process.env.WEBSITE_DOMAIN || "onboarding@resend.dev",
        to: user.email,
        subject: "Reset Your Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #10b981; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0;">Password Reset Request</h1>
            </div>
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="color: #374151;">Hi <strong>${user.name || user.email}</strong>,</p>
              <p style="color: #374151;">Click the button below to reset your password.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}"
                   style="background-color: #10b981; color: white; padding: 14px 32px;
                          text-decoration: none; border-radius: 8px; font-size: 16px;
                          font-weight: bold; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">⚠️ This link will expire in <strong>1 hour</strong>.</p>
              <p style="color: #6b7280; font-size: 14px;">If you didn't request this, ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #9ca3af; font-size: 12px; text-align: center; word-break: break-all;">${url}</p>
            </div>
          </div>
        `,
      });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
      status: {
        type: "string",
        defaultValue: "active",
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
  plugins: [jwt()],
});
