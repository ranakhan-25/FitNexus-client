"use client";

import { postClasses } from "@/components/api/classes";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

const AddClassPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    trainerId: user?.id,
    trainerName: user?.name,
    className: "",
    category: "",
    difficulty: "",
    duration: "",
    schedule: "",
    price: "",
    description: "",
    image: "",
    status: "pending",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // IMAGE HANDLER
  // =========================
  const handleImage = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // =========================
  // IMG BB UPLOAD
  // =========================
  const uploadToImgBB = async (file) => {
    if (!file) return null;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key missing");
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error("Image upload failed");
    }

    return data.data.url;
  };

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload an image");
      return;
    }

    try {
      setLoading(true);

      // 1. upload image
      const imageUrl = await uploadToImgBB(file);

      // 2. prepare payload
      const payload = {
        ...formData,
        trainerId: user?.id,
        trainerName: user?.name,
        image: imageUrl,
        status: "pending",
      };

      // 3. send to backend
      const result = await postClasses(payload);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);

      // reset form
      setFormData({
        className: "",
        category: "",
        difficulty: "",
        duration: "",
        schedule: "",
        price: "",
        description: "",
      });

      setFile(null);
      setPreview(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Add New Class</h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 border rounded-xl bg-white dark:bg-black"
      >
        {/* CLASS NAME */}
        <input
          type="text"
          name="className"
          value={formData.className}
          onChange={handleChange}
          placeholder="Class Name"
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* IMAGE UPLOAD */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Class Image</label>

          <label className="flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <span className="text-gray-500 text-sm">
              {preview ? "Image selected" : "Upload class image"}
            </span>

            <span className="text-blue-500 text-sm font-medium">Browse</span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>

          {/* PREVIEW */}
          {preview && (
            <Image
              src={preview}
              alt="preview"
              width={20}
              height={20}
              className="w-24 h-24 object-cover rounded-full border mx-auto mt-2"
            />
          )}
        </div>

        {/* CATEGORY */}
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* DIFFICULTY */}
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md text-gray-500"
        >
          <option value="">Select Difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        {/* DURATION */}
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Duration"
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* SCHEDULE */}
        <input
          type="text"
          name="schedule"
          value={formData.schedule}
          onChange={handleChange}
          placeholder="Schedule"
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* PRICE */}
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
        />

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Add Class"}
        </button>
      </form>
    </div>
  );
};

export default AddClassPage;
