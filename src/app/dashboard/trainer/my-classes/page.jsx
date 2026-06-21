"use client";

import { getToken } from "@/components/service/getToken";
import { authClient } from "@/lib/auth-client";
import { Delete, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MyClassesPage = () => {
  const { data: session } = authClient.useSession();
  const trainerId = session?.user?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes?trainerId=${trainerId}`,
        );
        const data = await res.json();

        setClasses(data.classes || []);
      } catch (error) {
        toast.error("Failed to load classes");
      } finally {
        setLoading(false);
      }
    };

    if (trainerId) fetchClasses();
  }, [trainerId]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    const token = await getToken()
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          }
         },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setClasses(classes.filter((c) => c._id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateClick = (item) => {
    setEditData(item);
    setIsOpen(true);
  };

  const handleUpdateSave = async () => {
    try {
      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/${editData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Updated successfully");

      setClasses((prev) =>
        prev.map((c) => (c._id === editData._id ? editData : c)),
      );

      setIsOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // =========================
  // VIEW STUDENTS
  // =========================
  const viewStudents = async (classId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/class/${classId}`,
      );

      const data = await res.json();

      setStudents(data.data || []);
      setSelectedClass(classId);
    } catch (error) {
      toast.error("Failed to load students");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Classes</h1>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">Class</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-3 font-medium">{item.className}</td>

                <td>{item.category}</td>
                <td>${item.price}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.status === "Approved"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="flex gap-2 p-2">
                  {/* UPDATE */}
                  <button
                    onClick={() => handleUpdateClick(item)}
                    className="px-3 py-1 rounded"
                  >
                    <Edit />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    <Delete />
                  </button>

                  {/* VIEW STUDENTS */}
                  <button
                    onClick={() => viewStudents(item._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Students
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
          STUDENTS MODAL
      ========================= */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[400px]">
            <h2 className="text-lg font-bold mb-3">Enrolled Students</h2>

            {students.length === 0 ? (
              <p>No students found</p>
            ) : (
              students.map((s, i) => (
                <div key={i} className="border-b py-2">
                  <p>{s.userName}</p>
                  <p className="text-sm text-gray-500">{s.email}</p>
                </div>
              ))
            )}

            <button
              onClick={() => setSelectedClass(null)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isOpen && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 w-[450px] rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold">Update Class</h2>

            {/* CLASS NAME */}
            <input
              className="w-full p-2 border rounded"
              value={editData.className}
              onChange={(e) =>
                setEditData({ ...editData, className: e.target.value })
              }
              placeholder="Class Name"
            />

            {/* CATEGORY */}
            <input
              className="w-full p-2 border rounded"
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
              placeholder="Category"
            />

            {/* PRICE */}
            <input
              className="w-full p-2 border rounded"
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
              placeholder="Price"
            />

            {/* SCHEDULE */}
            <input
              className="w-full p-2 border rounded"
              value={editData.schedule}
              onChange={(e) =>
                setEditData({ ...editData, schedule: e.target.value })
              }
              placeholder="Schedule"
            />

            {/* DESCRIPTION */}
            <textarea
              className="w-full p-2 border rounded"
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              placeholder="Description"
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClassesPage;
