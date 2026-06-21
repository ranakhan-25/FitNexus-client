"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Award, Dumbbell, Loader2, Send } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { getToken } from "@/components/service/getToken";

export default function ApplyTrainerPage() {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    experience: "",
    specialty: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trainer-applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user?.id,
            name: user?.name,
            email: user?.email,
            image: user?.image,
            experience: Number(formData.experience),
            specialty: formData.specialty,
          }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        return toast.error(data.message);
      }

      toast.success("Application Submitted");
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-5">
      {/* Header */}

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-bold">Become a Trainer</h1>

        <p className="mt-2 text-green-100">
          Share your expertise and inspire members.
        </p>
      </div>

      {/* User Card */}

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border dark:border-zinc-800 p-6">
        <div className="flex items-center gap-4">
          <Image
            src={user?.image || "image.png"}
            alt=""
            width={12}
            height={12}
            className="w-16 h-16 rounded-full"
          />

          <div>
            <h3 className="font-bold text-xl dark:text-white">{user?.name}</h3>

            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6 shadow-sm"
      >
        {/* Experience */}
        <div>
          <label className="block mb-2 font-medium text-zinc-700 dark:text-zinc-200">
            Experience (Years)
          </label>

          <input
            type="number"
            required
            min="0"
            value={formData.experience}
            onChange={(e) =>
              setFormData({
                ...formData,
                experience: e.target.value,
              })
            }
            placeholder="Enter your experience"
            className="w-full h-12 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 px-4 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Specialty */}
        <div>
          <label className="block mb-2 font-medium text-zinc-700 dark:text-zinc-200">
            Specialty
          </label>

          <select
            required
            value={formData.specialty}
            onChange={(e) =>
              setFormData({
                ...formData,
                specialty: e.target.value,
              })
            }
            className="w-full h-12 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Specialty</option>
            <option value="Yoga">Yoga</option>
            <option value="Weights">Weights</option>
            <option value="Cardio">Cardio</option>
            <option value="CrossFit">CrossFit</option>
            <option value="Zumba">Zumba</option>
            <option value="Strength Training">Strength Training</option>
            <option value="Bodybuilding">Bodybuilding</option>
            <option value="HIIT">HIIT</option>
          </select>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4">
          <div className="flex gap-3">
            <Award
              size={24}
              className="text-amber-600 dark:text-amber-400 flex-shrink-0"
            />

            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white">
                Application Status
              </h4>

              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your trainer application will be submitted with a{" "}
                <span className="font-semibold">Pending</span> status and
                reviewed by an administrator.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold flex justify-center items-center gap-2 transition-all"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Application
            </>
          )}
        </button>
      </form>
    </div>
  );
}
