"use client";

import { useEffect, useState } from "react";
import { Trash2, Search, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { getToken } from "@/components/service/getToken";
import Image from "next/image";

export default function ManageForumPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      // BUG FIX: process.env যুক্ত করা হয়েছে
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/forum-posts`,
      );
      const data = await res.json();

      setPosts(data.data || []);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // delete post
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (!confirm) return;

    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/forum-posts/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Post deleted successfully");
        fetchPosts();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Live filter search logic
  const filteredPosts = posts.filter(
    (post) =>
      post?.title?.toLowerCase().includes(search.toLowerCase()) ||
      post?.userName?.toLowerCase().includes(search.toLowerCase()) ||
      post?.userEmail?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-800 dark:text-slate-100">
      {/* Header with Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Forum Posts
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Moderate and delete inappropriate content or community posts.
            </p>
          </div>

          <div className="relative w-full sm:w-72 md:w-80 flex-shrink-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, user or email..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Live Posts
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              {posts.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Author</th>
                <th className="py-4 px-6">Post Title</th>
                <th className="py-4 px-6">Content Snippet</th>
                <th className="py-4 px-6">Published</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-sm text-slate-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Syncing community posts...
                    </div>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">
                      No Posts Found
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      No community posts match your criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* USER */}
                    {console.log(post)}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {post.authorName}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {post.email}
                      </p>
                    </td>

                    {/* TITLE */}
                    <td className="py-4 px-6 font-medium text-sm text-slate-900 dark:text-slate-100 max-w-[200px] truncate">
                      {post.title}
                    </td>

                    {/* CONTENT */}
                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400 max-w-[250px] truncate">
                      {post.description || post.content}
                    </td>

                    {/* DATE */}
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* ACTION */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS VIEW */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="text-center py-12 text-sm text-slate-500">
              Loading posts data...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">
                No Posts Found
              </h3>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post._id}
                className="p-4 bg-white dark:bg-slate-900 space-y-3"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5 line-clamp-1">
                      {post.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg">
                  {post.description || post.content}
                </p>

                <div className="pt-1 text-[11px] text-slate-400 dark:text-slate-500 flex justify-between">
                  <span>
                    By: <b>{post.userName}</b>
                  </span>
                  <span className="truncate max-w-[150px]">
                    {post.userEmail}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
