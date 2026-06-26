"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { Flame, Clock, Tag, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function FeaturedClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession()
  const user = session?.user;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res = await fetch(`${serverUrl}/api/classes`);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Server responded with status: ${res.status}`);
        }

        const data = await res.json();
        
        if (data && data.success !== false) {
          setClasses(data.classes || []);
        } else {
          throw new Error(data.message || "Failed to get successful response");
        }

      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  
  if (loading) {
    return (
      <section className="mt-10 max-w-7xl mx-auto px-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 max-w-7xl mx-auto px-4 text-slate-800 dark:text-slate-100">
      
     
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-100 dark:border-amber-500/20">
            <Flame size={14} className="animate-pulse" /> Top Picked Sessions
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
            Featured Classes
          </h2>
        </div>

        <Link
          href="/classes"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all font-medium text-sm shadow-md hover:shadow-blue-500/20 active:scale-95"
        >
          View All Classes
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* CLASSES GRID */}
      {classes.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/60 rounded-3xl">
          <p className="text-slate-500 dark:text-slate-400">No featured classes available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-26">
          {classes.slice(0, 6).map((cls) => (
            <div
              key={cls._id}
              className="group bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-md overflow-hidden hover:border-blue-500/30 dark:hover:border-slate-700/80 transition-all duration-300 flex flex-col hover:-translate-y-1.5 shadow-sm hover:shadow-xl dark:hover:shadow-blue-950/10"
            >
              {/* CARD IMAGE */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                <Image
                  src={cls.image || "/class.jpg"}
                  alt={cls.className || "Class thumbnail"}
                  fill
                  loading="lazy"
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 capitalize shadow-sm">
                  {cls.category || "Fitness"}
                </div>
              </div>

              <div className="p-6 flex flex-col grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {cls.className}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">
                    By <span className="text-slate-700 dark:text-slate-300 font-semibold">{cls.trainerName}</span>
                  </p>

                  {/* METADATA (DURATION & CATEGORY) */}
                  <div className="grid grid-cols-2 gap-2 my-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-400 dark:text-slate-500" />
                      <span>{cls.duration} Mins</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Tag size={14} className="text-slate-400 dark:text-slate-500" />
                      <span className="capitalize">{cls.category || "Fitness"}</span>
                    </div>
                  </div>
                </div>

                {/* PRICE & ACTION */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Price</p>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">${cls.price}</p>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 px-3 py-1.5 rounded-xl text-right">
                      <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        🔥 {cls.bookingCount || 0} Booked
                      </span>
                    </div>
                  </div>

                  {
                    user ?<Link
                    href={`/classes/${cls._id}`}
                    className="block w-full text-center bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.99] text-sm"
                  >
                    View Details
                  </Link> : <Link
                    href={`/unauthorized`}
                    className="block w-full text-center bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.99] text-sm"
                  >
                    View Details
                  </Link>
                  }
                  
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </section>
  );
}