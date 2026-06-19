
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const deleteForumPost = async (id) => {
  const res = await fetch(`${baseUrl}/api/forum-posts/${id}`, {
    method: "DELETE",
  });

  return await res.json();
};