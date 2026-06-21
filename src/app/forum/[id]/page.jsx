"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { getToken } from "@/components/service/getToken";

const ForumDetailsPage = () => {
  const { id } = useParams();

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [active, setActive] = useState("btn1");
  const [activeReply, setActiveReply] = useState(null);

  // ================= FETCH POST =================
  useEffect(() => {

    const fetchPost = async () => {
      try {
        const token = await getToken()
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-post/${id}`, {
            headers: {
              authorization: `Bearer ${token}`,
            }
          }
        );

        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        setPost(data.post);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // ================= LIKE =================
  const handleLike = async () => {
    try {
      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${id}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json",authorization: `Bearer ${token}`,},
          body: JSON.stringify({ userId: user.id }),
        },
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setPost((prev) => ({
        ...prev,
        likes: (prev.likes || 0) + 1,
        dislikes: 0,
      }));

      setActive("btn1")
      // toast.success("Liked!");
    } catch (err) {
      // toast.error(err.message);
    }
  };

  // ================= DISLIKE =================
  const handleDislike = async () => {
    try {
      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${id}/dislike`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json",authorization: `Bearer ${token}`, },
          body: JSON.stringify({ userId: user.id }),
        },
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setPost((prev) => ({
        ...prev,
        dislikes: (prev.dislikes || 0) + 1,
        likes: 0,
      }));

      setActive("btn2")
      // toast.success("Disliked!");
    } catch (err) {
      // toast.error(err.message);
    }
  };

  // ================= ADD COMMENT =================
  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
    const token = await getToken()
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${id}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json",authorization: `Bearer ${token}`, },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userImage: user.image,
          text: comment,
        }),
      }
    );

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    setPost((prev) => ({
      ...prev,
      comments: [
        ...(prev.comments || []),
        {
          ...data.comment, // backend real comment use
        },
      ],
    }));

    setComment("");
    // toast.success("Comment added");
  } catch (err) {
    // toast.error(err.message);
  }
};

  // ================= REPLY =================
  const handleReply = async (commentId) => {
    try {
      const text = replyText[commentId];

      if (!text || text.trim() === "") {
        return 
      }

      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${id}/comments/${commentId}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json",authorization: `Bearer ${token}`, },
          body: JSON.stringify({
            userId: user.id,
            userName: user.name,
            userImage: user.image,
            text,
          }),
        },
      );

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId
            ? {
                ...c,
                replies: [
                  ...(c.replies || []),
                  {
                    _id: data.reply._id,
                    userId: user.id,
                    userName: user.name,
                    userImage: user.image,
                    text: data.reply.text,
                    createdAt: data.reply.createdAt,
                  },
                ],
              }
            : c,
        ),
      }));

      setReplyText((prev) => ({
        ...prev,
        [commentId]: "",
      }));

      setActiveReply(null);

      // toast.success("Reply added");
    } catch (err) {
      // toast.error(err.message);
    }
  };

  // ================= DELETE COMMENT =================
  const handleDeleteComment = async (commentId) => {
    try {
      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${id}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json",authorization: `Bearer ${token}`, },
          body: JSON.stringify({
            userId: user.id,
          }),
        },
      );

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));

      // toast.success("Comment deleted");
    } catch (err) {
      // toast.error(err.message);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${id}/comments/${commentId}/replies/${replyId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json",authorization: `Bearer ${token}`, },
          body: JSON.stringify({
            userId: user.id,
          }),
        },
      );

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId
            ? {
                ...c,
                replies: (c.replies || []).filter((r) => r._id !== replyId),
              }
            : c,
        ),
      }));

      // toast.success("Reply deleted");
    } catch (err) {
      // toast.error(err.message);
    }
  };
  // ================= LOADING =================
  if (loading) return <p className="p-10">Loading...</p>;
  if (!post) return <p className="p-10">Post not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* IMAGE */}
      <Image
        src={post?.image || "image.png"}
        width={800}
        height={400}
        className="w-full rounded-2xl"
        alt="post"
      />

      {/* TITLE */}
      <h1 className="text-3xl font-bold">{post.title}</h1>

      {/* AUTHOR */}
      <p className="text-gray-500">By {post.authorName}</p>

      {/* DESCRIPTION */}
      <p className="text-gray-700 dark:text-gray-300">{post.description}</p>

      {/* LIKE / DISLIKE */}
      <div className="flex gap-4">
        <button
          onClick={handleLike}
         className={`px-4 py-2 rounded text-white ${
          active === "btn1" ? "bg-green-500" : "bg-gray-400"
        }`} 
        >
          👍 Like ({post.likes || 0})
        </button>

        <button
          onClick={handleDislike}
          className={`px-4 py-2 rounded text-white ${
          active === "btn2" ? "bg-green-500" : "bg-gray-400"
        }`}
        >
          👎 Dislike ({post?.dislikes || 0})
        </button>
      </div>

      {/* COMMENTS */}
      <div className="mt-10">
        <div>
          <h2 className="text-xl font-bold mb-4 inline-block">Comments</h2> <span className="text-sm text-green-600">{post?.comments?.length || 0}</span>
        </div>
       

        {/* input */}
        <div className="flex gap-2 mb-6">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Write a comment..."
          />
          <button
            onClick={handleComment}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Post
          </button>
        </div>

        {/* list */}
        <div className="space-y-5">
          {(post.comments || []).map((c) => (
            
            <div
              key={c._id}
              className="bg-white dark:bg-gray-900 border rounded-2xl p-5 shadow-sm"
            >
              {/* Comment Header */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <Image
                    src={c?.userImage || "/image.png"}
                    width={40}
                    height={40}
                    alt=""
                    className="rounded-full"
                  />

                  <div>
                    <h3 className="font-semibold">{c.userName}</h3>

                    <p className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {c.userId === user?.id && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Comment Text */}
              <p className="mt-3">{c.text}</p>

              {/* Reply Button */}
              <button
                onClick={() =>
                  setActiveReply(activeReply === c._id ? null : c._id)
                }
                className="text-green-600 text-sm mt-3"
              >
                Reply
              </button>

              {/* Reply Box */}
              {activeReply === c._id && (
                <div className="flex gap-2 mt-3">
                  <input
                    value={replyText[c._id] || ""}
                    onChange={(e) =>
                      setReplyText({
                        ...replyText,
                        [c._id]: e.target.value,
                      })
                    }
                    className="border p-2 rounded-xl w-full"
                    placeholder="Write reply..."
                  />

                  <button
                    onClick={() => handleReply(c._id)}
                    className="bg-green-500 text-white px-4 rounded-xl"
                  >
                    Send
                  </button>
                </div>
              )}

              {/* Replies */}
              {(c.replies || []).length > 0 && (
                <div className="ml-10 mt-4 border-l pl-4 space-y-3">
                  {c.replies.map((r) => (
                    <div
                      key={r._id}
                      className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl"
                    >
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <Image
                            src={r.userImage || "/avatar.png"}
                            width={30}
                            height={30}
                            alt=""
                            className="rounded-full"
                          />

                          <div>
                            <p className="font-medium text-sm">{r.userName}</p>

                            <p className="text-xs text-gray-500">
                              {new Date(r.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {r.userId === user?.id && (
                          <button
                            className="text-red-500 text-xs"
                            onClick={() => handleDeleteReply(c._id, r._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      <p className="mt-2 text-sm">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumDetailsPage;
