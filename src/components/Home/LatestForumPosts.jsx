"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { MessageSquare, Calendar, User, ArrowUpRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LatestForumPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession()
  const user = session?.user;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/api/forum/latest`);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Server responded with status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setPosts(data.posts || []);
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (err) {
        toast.error(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Loading Skeleton State for Light & Dark Mode
  if (loading) {
    return (
      <section className="mt-16 max-w-7xl mx-auto px-5">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-64 bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 max-w-7xl mx-auto px-5 text-slate-800 dark:text-slate-100">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-purple-100 dark:border-purple-500/20">
            <MessageSquare size={14} /> Community Pulse
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Latest Forum Discussions
          </h2>
        </div>

        <Link
          href="/forum"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white text-sm font-medium transition-all shadow-sm active:scale-95"
        >
          View Full Forum
          <ArrowUpRight size={16} className="text-slate-400 dark:text-slate-500" />
        </Link>
      </div>

      {/* POSTS GRID */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/60 rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No forum posts found active today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          { posts?.map((post) => (
            <div
              key={post._id}
              className="group bg-white dark:bg-slate-900/30 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-3xl overflow-hidden hover:border-purple-500/30 dark:hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between p-6 hover:-translate-y-1 shadow-sm hover:shadow-xl dark:hover:shadow-purple-950/10"
            >
              <div className="space-y-4">
                
                {/* AUTHOR PROFILE INFO & DATE */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                      {post.authorImage || post.userImage ? (
                        <Image
                          src={post.authorImage || post.userImage}
                          alt={post.authorName || "User avatar"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <User size={14} className="text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {post.authorName || post.userName || "Anonymous"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800/50">
                    <Calendar size={12} className="text-slate-400 dark:text-slate-500" />
                    <span>
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      }) : "Recent"}
                    </span>
                  </div>
                </div>

                {/* POST IMAGE */}
                {post.image && (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-none">
                    <Image
                      src={post.image}
                      alt={post.title || "Post thumbnail"}
                      fill
                      className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                )}

                {/* CONTENT (TITLE & DESCRIPTION) */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {post.description || post.content}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/40">
                
                {
                  user ? <Link
                  href={`/forum/${post._id}`}
                  className="w-full inline-flex items-center justify-center bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 rounded-2xl transition-all shadow-md hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.99] text-sm"
                >
                  Read Discussion
                </Link> :  <Link
                  href={`/unauthorized`}
                  className="w-full inline-flex items-center justify-center bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 rounded-2xl transition-all shadow-md hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.99] text-sm"
                >
                  Read Discussion
                </Link>
                }
                
              </div>

            </div>
          ))}
        </div>
      )}
    </section>
  );
}