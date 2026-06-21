"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CommunityForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;

  // =========================
  // FETCH POSTS
  // =========================
  const fetchPosts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit,
      });

      if (search) params.append("search", search);
      if (role) params.append("role", role);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts?${params.toString()}`
      );

      const data = await res.json();

      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log(error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // AUTO FETCH
  // =========================
  useEffect(() => {
    fetchPosts();
  }, [page, role]);

  // =========================
  // SEARCH (DEBOUNCE)
  // =========================
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchPosts();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* HERO */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Community Forum
        </h1>

        <p className="text-gray-500 mt-2">
          Learn from trainers and admin posts
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">

        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border dark:border-gray-700 px-4 py-3 rounded-xl w-full md:w-[400px] bg-white dark:bg-gray-900"
        />

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="border dark:border-gray-700 px-4 py-3 rounded-xl bg-white dark:bg-gray-900"
        >
          <option value="">All Roles</option>
          <option value="trainer">Trainer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-20 text-gray-500">
          Loading posts...
        </div>
      )}

      {/* EMPTY */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No posts found
        </div>
      )}

      {/* GRID */}
      {!loading && posts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {posts.map((post) => (
            <div
              key={post._id}
              className="border dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition"
            >

              {/* IMAGE */}
              <Image
                src={post.image}
                alt={post.title}
                width={500}
                height={300}
                className="w-full h-52 object-cover"
              />

              <div className="p-5 space-y-3">

                {/* TITLE */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {post.title}
                </h2>

                {/* AUTHOR */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Image
                    src={post.authorImage}
                    width={30}
                    height={30}
                    className="rounded-full"
                    alt="author"
                  />
                  <span>{post.authorName}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-600">
                    {post.role}
                  </span>
                </div>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-500">
                  {post.description?.slice(0, 100)}...
                </p>

                {/* FOOTER */}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>👍 {post.likes}</span>
                  <span>👎 {post.dislikes}</span>
                </div>

                {/* READ MORE */}
                <Link
                  href={`/forum/${post._id}`}
                  className="block text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
                >
                  Read More
                </Link>

              </div>
            </div>
          ))}

        </div>
      )}

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10 flex-wrap">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 border rounded-lg ${
                page === i + 1 ? "bg-green-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
};

export default CommunityForumPage;