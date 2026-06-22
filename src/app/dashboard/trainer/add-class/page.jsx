"use client";

import { getToken } from "@/components/service/getToken";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddClassPage = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const router = useRouter()
  const [formData, setFormData] = useState({
    trainerId: "",
    trainerName: "",
    className: "",
    category: "",
    difficulty: "",
    duration: "",
    schedule: "",
    price: "",
    description: "",
    image: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        trainerId: user.id,
        trainerName: user.name,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    const form = new FormData();
    form.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const imageUrl = await uploadImage(file);

      const payload = {
        ...formData,
        image: imageUrl,
        status: "Pending",
        bookingCount: 0,
      };

      const token = await getToken()

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Class created successfully");

      setFormData({
        trainerId: user.id,
        trainerName: user.name,
        trainerEmail: user.email,
        className: "",
        category: "",
        difficulty: "",
        duration: "",
        schedule: "",
        price: "",
        description: "",
        image: "",
      });

      setFile(null);
      setPreview(null);
      router.refresh()
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Class</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="className"
          placeholder="Class Name"
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Class Image
          </label>

          <label className="flex items-center pl-3  w-full h-10 border  cursor-pointer transition">
            <span className="text-xs text-gray-400 mt-1">
              PNG, JPG (Max 2MB)
            </span>

            <input
              required
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </label>

          {/* Preview */}
          {preview && (
            <div className="flex justify-center mt-3">
              <Image
                src={preview}
                width={100}
                height={100}
                alt="preview"
                className="w-24 h-24 object-cover rounded-full border-2 border-red-500 shadow-md"
              />
            </div>
          )}
        </div>

        <input
          required
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <input
          required
          name="difficulty"
          placeholder="Difficulty"
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <input
          required
          name="duration"
          placeholder="Duration"
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <input
          required
          name="schedule"
          placeholder="Schedule"
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <input
          required
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <textarea
          required
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <button
          disabled={loading}
          className="w-full bg-red-500 text-white py-2"
        >
          {loading ? "Creating..." : "Add Class"}
        </button>
      </form>
    </div>
  );
};

export default AddClassPage;
