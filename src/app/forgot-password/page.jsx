"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { authClient, getAppUrl } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setIsError(false);

      const { error } = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: `${getAppUrl()}/reset-password`,
      });

      if (error) {
        setIsError(true);
        setMessage(error.message || "Something went wrong. Please try again.");
      } else {
        setIsSuccess(true);
        setMessage("Password reset link has been sent to your email address.");
      }
    } catch (error) {
      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Check Your Email
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
              We sent a password reset link to
            </p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
              {email}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
                setMessage("");
              }}
              className="w-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-3 rounded-xl font-medium transition hover:bg-zinc-50 dark:hover:bg-zinc-700"
            >
              Try Again
            </button>
            <Link
              href="/login"
              className="block mt-3 text-sm text-center text-emerald-600 hover:underline font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
          {/* Back Button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Forgot Password?
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Error Message */}
            {isError && message && (
              <div className="text-sm px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                {message}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !email}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-emerald-600 hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
