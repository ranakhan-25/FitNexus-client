"use client";

import { authClient } from "@/lib/auth-client";
import { Check } from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [role, setRole] = useState("user");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const router = useRouter();

  const handleImage = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    return data.data.url;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());

    let imageUrl = "";
    if (file) imageUrl = await uploadToImgBB(file);

    const finalData = { ...userData, role, image: imageUrl };

    const { data, error } = await authClient.signUp.email({
      email: finalData.email,
      password: finalData.password,
      name: finalData.name,
      image: finalData.image,
      role: finalData.role,
      callbackURL: `/`,
    });

    if (error) {
      toast.success("Register is Filed !");
    }
    if (data) {
      toast.success("Register successfully");
      router.push(`/`);
    }
  };

  const handleGoogleLogin = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black p-4">
      {/* CARD */}
      <div className="w-full my-10 max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center mb-1">Create Account</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Join our fitness platform
        </p>

        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {/* NAME */}
          <TextField name="name" isRequired minLength={3}>
            <Label className="text-sm font-medium">Full Name</Label>
            <Input placeholder="Enter your name" className="rounded-lg" />
            <FieldError />
          </TextField>

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
            <Label className="text-sm font-medium">Email</Label>
            <Input placeholder="example@mail.com" className="rounded-lg" />
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
            <Label className="text-sm font-medium">Password</Label>
            <Input placeholder="••••••••" className="rounded-lg" />
            <Description>8+ chars, 1 uppercase, 1 number</Description>
            <FieldError />
          </TextField>

          {/* IMAGE */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Profile Image</Label>

            <label className="flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <span className="text-gray-500 text-sm">
                {preview ? "Image selected" : "Upload profile image"}
              </span>
              <span className="text-blue-500 text-sm font-medium">Browse</span>

              <input
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
            </label>

            {preview && (
              <Image
                src={preview}
                width={10}
                height={10}
                alt="image"
                className="w-20 h-20 object-cover rounded-full border mx-auto mt-2"
              />
            )}
          </div>

          {/* ROLE */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Select Role</Label>

            <div className="grid grid-cols-3 gap-2">
              {["user", "trainer", "admin"].map((item) => (
                <label
                  key={item}
                  className={`text-center py-2 rounded-lg border cursor-pointer text-sm transition ${
                    role === item
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <input
                    type="radio"
                    value={item}
                    checked={role === item}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2 mt-2"
          >
            <Check />
            Create Account
          </Button>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg py-2 my-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
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
        <Link href="/login" className="text-sm text-center block mt-3">
          Already have account? <span className="text-green-500">Login</span>
        </Link>
      </div>
    </div>
  );
}
