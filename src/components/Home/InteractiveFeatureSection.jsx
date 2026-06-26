"use client";

import { useState } from "react";
import { Sparkles, Shield, Zap, Target, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function InteractiveFeatureSection() {
  const [activeCard, setActiveCard] = useState(0);

  const features = [
    {
      id: 0,
      icon: <Zap size={24} className="text-amber-500 dark:text-amber-400" />,
      title: "Ultra-Fast Performance",
      description: "Experience lightning-fast workout tracking and real-time synchronization with our edge-optimized network engine.",
      tag: "Speed",
      bgGradient: "from-amber-50 to-orange-50/30 dark:from-amber-600/20 dark:to-orange-600/5",
      borderColor: "border-amber-500/30 dark:border-amber-500/40"
    },
    {
      id: 1,
      icon: <Shield size={24} className="text-blue-500 dark:text-blue-400" />,
      title: "Premium Data Security",
      description: "Your health records, billing profiles, and schedule metadata are fully encrypted with military-grade protocols.",
      tag: "Security",
      bgGradient: "from-blue-50 to-indigo-50/30 dark:from-blue-600/20 dark:to-indigo-600/5",
      borderColor: "border-blue-500/30 dark:border-blue-500/40"
    },
    {
      id: 2,
      icon: <Target size={24} className="text-purple-500 dark:text-purple-400" />,
      title: "AI-Powered Analytics",
      description: "Get hyper-personalized recommendations, dynamic class predictions, and predictive performance heatmaps dynamically.",
      tag: "AI Smart",
      bgGradient: "from-purple-50 to-pink-50/30 dark:from-purple-600/20 dark:to-pink-600/5",
      borderColor: "border-purple-500/30 dark:border-purple-500/40"
    }
  ];

  return (
    <section className="relative my-24 max-w-7xl mx-auto px-4 overflow-hidden text-slate-800 dark:text-slate-100">
      
      
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none hidden dark:block" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none hidden dark:block" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            <Sparkles size={14} className="animate-spin-[duration:4s]" /> Next-Gen Platform
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            We Redefined The <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
              Fitness Experience.
            </span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            Explore advanced functionalities curated for world-class athletes and premium club management. Interactive automation right at your fingertips.
          </p>

          {/* Perks List */}
          <div className="space-y-3.5 pt-4">
            {[
              "Real-time schedule micro-adjustments",
              "Automated trainer slot allocations",
              "Cross-platform profile telemetry sync"
            ].map((perk, index) => (
              <div key={index} className="flex items-center gap-3 group/item">
                <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400 group-hover/item:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-slate-100 transition-colors">
                  {perk}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: DYNAMIC ANIMATED CARDS */}
        <div className="lg:col-span-7 grid grid-cols-1 gap-6">
          {features.map((feat) => {
            const isSelected = activeCard === feat.id;
            
            return (
              <div
                key={feat.id}
                onMouseEnter={() => setActiveCard(feat.id)}
                className={`group relative p-6 sm:p-8 rounded-xl border transition-all duration-500 cursor-pointer flex flex-col sm:flex-row items-start gap-6 overflow-hidden ${
                  isSelected
                    ? `bg-linear-to-br ${feat.bgGradient} ${feat.borderColor} shadow-xl dark:shadow-2xl dark:shadow-black/40 translate-x-2`
                    : "bg-white dark:bg-slate-900/30 backdrop-blur-md border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Active Indicator Line */}
                <div className={`absolute top-0 left-0 w-1 h-full bg-linear-to-b from-blue-500 to-purple-500 transition-opacity duration-300 ${
                  isSelected ? "opacity-100" : "opacity-0"
                }`} />

                {/* Icon Box */}
                <div className={`p-4 rounded-2xl border transition-all duration-300 shrink-0 group-hover:scale-110 ${
                  isSelected
                    ? "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700/60 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}>
                  {feat.icon}
                </div>

                {/* Text Content */}
                <div className="space-y-2 grow">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${
                      isSelected 
                        ? "text-slate-900 dark:text-white" 
                        : "text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                    }`}>
                      {feat.title}
                    </h3>
                    
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                      {feat.tag}
                    </span>
                  </div>
                  
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    isSelected
                      ? "text-slate-700 dark:text-slate-300"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  }`}>
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}