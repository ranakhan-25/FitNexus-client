"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { Search, Trash2, MessageSquare, ThumbsUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getToken } from "@/components/service/getToken";

const MyForumPostsPage = () => {
  const { data: session } = authClient.useSession();

  const userId = session?.user?.id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (userId) {
      fetchMyPosts();
    }
  }, [userId]);

  const fetchMyPosts = async () => {
    try {
      if (!userId) return;
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${userId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts(data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this forum post?",
    );

    if (!confirmed) return;

    const token = await getToken();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setPosts((prev) => prev.filter((item) => item._id !== id));

      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [posts, search]);

  const totalLikes = posts.reduce((sum, item) => sum + (item.likes || 0), 0);

  return (
    <div className="max-w-7xl mx-auto p-5">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          My Forum Posts
        </h1>

        <p className="text-gray-500 mt-2">
          Manage and monitor all your community posts.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border shadow-sm">
          <h3 className="text-gray-500 text-sm">Total Posts</h3>

          <p className="text-4xl font-bold mt-2">{posts.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border shadow-sm">
          <h3 className="text-gray-500 text-sm">Total Likes</h3>

          <p className="text-4xl font-bold mt-2">{totalLikes}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border shadow-sm">
          <h3 className="text-gray-500 text-sm">Community Status</h3>

          <p className="text-xl font-semibold text-green-500 mt-3">
            Active Contributor
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 border rounded-3xl p-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search your posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border rounded-2xl bg-transparent"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border"
            >
              <div className="h-56 bg-gray-200 dark:bg-gray-800" />

              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPosts.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border p-16 text-center">
          <div className="text-6xl mb-4">📝</div>

          <h2 className="text-2xl font-bold">No Posts Found</h2>

          <p className="text-gray-500 mt-3">
            You haven't created any forum posts yet.
          </p>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && filteredPosts.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300"
            >
              
              <Image
                src={post.image}
                alt={post.title}
                width={500}
                height={300}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-bold mb-3 line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-gray-500 text-sm line-clamp-4">
                  {post.description}
                </p>

                <div className="flex items-center justify-between mt-5">
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={16} />
                      {post.likes || 0}
                    </div>

                    <div className="flex items-center gap-1">
                      <MessageSquare size={16} />
                      {post?.comments?.length || 0}
                    </div>
                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(post._id)}
                  className="w-full mt-5 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl transition"
                >
                  <Trash2 size={18} />
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
