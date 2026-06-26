"use client";

import { useState } from "react";
import {
  Button,
  Form,
  Input,
  Label,
  TextField,
  FieldError,
} from "@heroui/react";
import Link from "next/link";
import { authClient, getAppUrl } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());

    const { error } = await authClient.signIn.email({
      email: userData.email,
      password: userData.password,
      callbackURL: `${getAppUrl()}/`,
    });

    setLoading(false);

    if (error) {
      return toast.error("Wrong Email and Password");
    }

    router.push("/");
  };

  // 🌐 Google login handler
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${getAppUrl()}/`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black p-4">
      {/* CARD */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center mb-1">Welcome Back</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Login to your account
        </p>

        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {/* EMAIL */}
          <TextField
            name="email"
            type="email"
            isRequired
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input placeholder="example@mail.com" />
            <FieldError />
          </TextField>

          {/* PASSWORD */}
          <TextField
            name="password"
            type="password"
            isRequired
            minLength={8}
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input placeholder="••••••••" />
          </TextField>

          {/* LOGIN BUTTON */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div>
            <Link href="/forgot-password" className="text-sm text-green-600 underline">Forgot Password?</Link>
          </div>
          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-2">
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
          </div>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {/* Google Icon */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.69 30.4 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.14 17.73 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.54 28.41a14.5 14.5 0 0 1 0-9.82l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.84.92 7.47 2.56 10.6l7.98-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.4 0 11.8-2.1 15.73-5.73l-7.73-6c-2.15 1.45-4.92 2.3-8 2.3-6.27 0-11.57-3.64-13.46-8.89l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Continue with Google
          </button>
        </Form>

        <Link href="/register" className="text-sm block text-center mt-3">
          Don’t have account? <span className="text-green-500">Register</span>
        </Link>
      </div>
    </div>
  );
}
