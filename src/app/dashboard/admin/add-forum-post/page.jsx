"use client";

import { getToken } from "@/components/service/getToken";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

const AddForumPostPage = () => {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const uploadToImgBB = async (file) => {
    const form = new FormData();

    form.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: form,
      },
    );

    const data = await res.json();

    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageUrl = "";

      if (file) {
        imageUrl = await uploadToImgBB(file);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,

        authorId: user?.id,
        authorName: user?.name,
        authorImage: user?.image,

        role: "trainer",

        likes: 0,
        dislikes: 0,

        createdAt: new Date(),
      };

      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts`,
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

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Forum post created successfully");

      setFormData({
        title: "",
        description: "",
      });

      setFile(null);
      setPreview("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Forum Post</h1>

        <p className="text-default-500 mt-2">
          Share fitness knowledge with the community.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border rounded-2xl p-6 space-y-5 bg-background md:w-xl"
      >
        {/* Title */}
        <div>
          <label className="font-medium mb-2 block">Post Title</label>

          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            className="w-full border rounded-xl px-4 py-3 bg-transparent"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="font-medium mb-2 block">Post Image</label>

          <label className="border rounded-xl p-3 flex justify-between items-center cursor-pointer">
            <span className="text-default-500">
              {preview ? "Image Selected" : "Upload forum image"}
            </span>

            <span className="font-medium text-primary">Browse</span>

            <input type="file" accept="image/*" hidden onChange={handleImage} />
          </label>

          {preview && (
            <Image
              src={preview}
              alt="preview"
              width={500}
              height={300}
              className="mt-4 w-full h-56 object-cover rounded-xl"
            />
          )}
        </div>

        {/* Description */}
        <div>
          <label className="font-medium mb-2 block">Description</label>

          <textarea
            rows={6}
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write your post..."
            className="w-full border rounded-xl px-4 py-3 bg-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 rounded-xl font-medium"
        >
          {loading ? "Publishing..." : "Publish Forum Post"}
        </button>
      </form>
    </div>
  );
};

export default AddForumPostPage;
