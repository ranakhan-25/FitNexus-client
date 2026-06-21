"use client";

import { Users, Dumbbell, Award, Activity, TrendingUp } from "lucide-react";

export default function StatsTelemetrySection() {
  const stats = [
    {
      id: 1,
      icon: <Users size={26} className="text-cyan-600 dark:text-cyan-400" />,
      value: "14,200+",
      label: "Active Members",
      change: "+12% this month",
      // ডাইনামিক হোভার এফেক্ট যা ডার্ক/লাইট মোডে চমৎকার গ্লো দেয়
      glowColor: "hover:shadow-cyan-500/5 dark:hover:shadow-cyan-500/10 hover:border-cyan-300 dark:hover:border-cyan-500/30",
    },
    {
      id: 2,
      icon: <Dumbbell size={26} className="text-emerald-600 dark:text-emerald-400" />,
      value: "850+",
      label: "Fitness Classes",
      change: "Live & On-Demand",
      glowColor: "hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/30",
    },
    {
      id: 3,
      icon: <Award size={26} className="text-purple-600 dark:text-purple-400" />,
      value: "99.4%",
      label: "Success Rate",
      change: "Client satisfaction",
      glowColor: "hover:shadow-purple-500/5 dark:hover:shadow-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/30",
    },
    {
      id: 4,
      icon: <Activity size={26} className="text-rose-600 dark:text-rose-400" />,
      value: "24/7",
      label: "Expert Coaching",
      change: "Global accessibility",
      glowColor: "hover:shadow-rose-500/5 dark:hover:shadow-rose-500/10 hover:border-rose-300 dark:hover:border-rose-500/30",
    },
  ];

  return (
    <section className="relative my-28 max-w-7xl mx-auto px-4 text-slate-800 dark:text-slate-100">
      
      {/* Background Decorative Mesh Grid - লাইট মোডে সফট এবং ডার্ক মোডে গ্লসি লুক */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 dark:opacity-20 pointer-events-none" />

      {/* SECTION MAIN CONTAINER */}
      <div className="bg-slate-50/60 dark:bg-slate-900/30 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-[32px] p-8 md:p-12 shadow-xl dark:shadow-2xl relative overflow-hidden">
        
        {/* Top Floating Core Glow - ডার্ক মোডে শুধুমাত্র দৃশ্যমান থাকবে */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none hidden dark:block" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: TEXT SUMMARY */}
          <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 rounded-full text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
              <TrendingUp size={12} /> Platform Metrics
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Numbers That Speak <br className="hidden lg:block" />
              For Our Results.
            </h2>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto lg:mx-0">
              We track real-time engagement telemetry across all training facilities to deliver optimized cloud scheduling and elite metrics.
            </p>
          </div>

          {/* RIGHT: LIVE TELEMETRY COUNTER GRID */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className={`group bg-white dark:bg-slate-950/40 backdrop-blur-md border border-slate-100 dark:border-slate-900 rounded-2xl p-6 transition-all duration-300 flex items-center justify-between shadow-sm dark:shadow-lg ${stat.glowColor}`}
              >
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                    {stat.label}
                  </p>
                  
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight group-hover:scale-[1.02] origin-left transition-transform">
                    {stat.value}
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse group-hover:bg-current" />
                    {stat.change}
                  </p>
                </div>

                {/* ICON CONTAINER WITH SMOOTH ROTATION */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/50 transition-all duration-500 group-hover:rotate-[15deg] group-hover:bg-slate-100 dark:group-hover:bg-slate-950">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}