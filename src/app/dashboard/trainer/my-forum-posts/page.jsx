"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MyForumPostsPage = () => {
  const { data: session } = authClient.useSession();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      fetchMyPosts();
    }
  }, [userId]);

  const fetchMyPosts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${userId}`
      );

      const data = await res.json();

      setPosts(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setPosts((prev) =>
        prev.filter((post) => post._id !== id)
      );

      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading posts...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Forum Posts
        </h1>

        <p className="text-default-500">
          Manage all your community posts.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="border rounded-2xl p-10 text-center">
          <h2 className="text-xl font-semibold">
            No Posts Found
          </h2>

          <p className="text-default-500 mt-2">
            You haven't created any forum posts yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              <Image
                src={post.image}
                alt={post.title}
                width={500}
                height={300}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">

                <h2 className="text-xl font-bold mb-2">
                  {post.title}
                </h2>

                <p className="text-default-500 text-sm mb-4">
                  {post.description.slice(0, 120)}...
                </p>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span>
                    👍 {post.likes}
                  </span>

                  <span>
                    👎 {post.dislikes}
                  </span>
                </div>

                <p className="text-xs text-default-400 mb-4">
                  {new Date(
                    post.createdAt
                  ).toLocaleDateString()}
                </p>

                <button
                  onClick={() =>
                    handleDelete(post._id)
                  }
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
                >
                  Delete Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyForumPostsPage;