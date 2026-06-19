"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const ApplyTrainerPage = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    experience: "",
    specialty: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // ✅ FIXED HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.experience || !formData.specialty) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setSuccess("");

      const payload = {
        userId: user?.id,
        name: user?.name,
        email: user?.email,
        experience: formData.experience,
        specialty: formData.specialty,
        status: "pending",
        feedback: "",
      };

      const res = await fetch("/api/dashboard/apply-trainer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit application");
      }

      setSuccess("Application submitted successfully! Status: Pending");

      setFormData({
        experience: "",
        specialty: "",
      });
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Apply as Trainer</h1>
        <p className="text-sm text-gray-500">
          Fill in your details to become a certified trainer
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 border rounded-xl bg-white dark:bg-black"
      >

        {/* Experience */}
        <div>
          <label className="text-sm font-medium">
            Experience (Years)
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g. 3"
            className="w-full mt-1 px-3 py-2 border rounded-md bg-transparent outline-none"
          />
        </div>

        {/* Specialty */}
        <div>
          <label className="text-sm font-medium">Specialty</label>
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-md bg-transparent outline-none"
          >
            <option value="">Select Specialty</option>
            <option value="Yoga">Yoga</option>
            <option value="Weights">Weights</option>
            <option value="Cardio">Cardio</option>
            <option value="CrossFit">CrossFit</option>
            <option value="Zumba">Zumba</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Apply Now"}
        </button>
      </form>
    </div>
  );
};

export default ApplyTrainerPage;