const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;


export const postClasses = async (payload) => {

  const res = await fetch(`${baseUrl}/api/classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return data
};

export const showClassDetails = async (classId) => {
  const res = await fetch(
    `${baseUrl}/api/classes/${classId}`
  );

  const data = await res.json();
  return data?.data;
};