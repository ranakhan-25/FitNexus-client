"use client"
import { getToken } from "@/components/service/getToken";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserShield,
  FaEdit,
  FaCamera,
  FaSave,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const token = await getToken(); 

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        _id: formData?.id, 
        name: formData?.name,
        image: formData?.image
      })
    });
    
    const data = await res.json();
    
    if (data.success) {
      setIsEditing(false);
      toast.success(data.message || "Profile updated successfully!");
      
     
      if (typeof authClient.updateUser === "function") {
        await authClient.updateUser({
          name: formData?.name,
          image: formData?.image
        });
      } else {
        window.location.assign(window.location.href); 
      }

    } else {
      toast.error(data.message || "Something went wrong!");
    }
  } catch (error) {
    toast.error("Server error occurred!");
  } finally {
    setLoading(false);
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

 
  if (isPending || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden mb-8 border border-slate-100 dark:border-slate-700/50">
          
          <div className="h-40 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="relative px-6 pb-6 pt-0 sm:px-8 sm:pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
            
            <div className="relative group w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg bg-slate-200">
              <Image
                src={formData?.image || "/user.png"}
                width={128}
                height={128}
                alt={formData?.name || "User"}
                className="w-full h-full object-cover"
              />
              {/* <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200">
                <FaCamera className="text-xl" />
              </button> */}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  {formData?.name}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider self-center sm:self-auto ${
                    formData?.role === "admin"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : formData?.role === "trainer"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  <FaUserShield className="mr-1" /> {formData?.role || "user"}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <FaEnvelope className="text-sm" /> {formData?.email}
              </p>
            </div>

            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {isEditing ? (
                  <>
                    <FaTimesCircle /> Cancel
                  </>
                ) : (
                  <>
                    <FaEdit /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Status
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-500">
                    <FaCheckCircle /> {formData?.status || "active"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Email Verified
                  </span>
                  {user?.emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-500">
                      <FaCheckCircle /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500">
                      <FaTimesCircle /> Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                Important Dates
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs text-slate-400 uppercase tracking-wider">
                    Joined On
                  </span>
                  <div className="flex items-center gap-2 mt-1 font-medium">
                    <FaCalendarAlt className="text-indigo-500" />{" "}
                    {formatDate(formData?.createdAt)}
                  </div>
                </div>
                <div>
                  <span className="block text-xs text-slate-400 uppercase tracking-wider">
                    Last Updated
                  </span>
                  <div className="flex items-center gap-2 mt-1 font-medium">
                    <FaCalendarAlt className="text-purple-500" />{" "}
                    {formatDate(formData?.updatedAt || formData?.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-700/50 h-full">
              {!isEditing ? (
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FaUser className="text-indigo-500" /> Profile Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">
                        Full Name
                      </span>
                      <p className="text-base font-semibold bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/30">
                        {formData?.name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">
                        Email Address
                      </span>
                      <p className="text-base font-semibold bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/30">
                        {formData?.email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">
                        User ID
                      </span>
                      <p className="text-xs font-mono bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/30 text-slate-500 dark:text-slate-400 overflow-x-auto">
                        {formData?.id}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">
                        Platform Role
                      </span>
                      <p className="text-base font-semibold bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/30 capitalize">
                        {user?.role || "user"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
               
                <form onSubmit={handleUpdate} className="space-y-5">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FaEdit className="text-indigo-500" /> Modify Profile Details
                  </h2>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData?.name || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Email (Read Only)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData?.email || ""}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData?.image || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <FaSave /> {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}