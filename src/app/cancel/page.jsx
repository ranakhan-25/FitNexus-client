"use client";

import { useRouter } from "next/navigation";

export default function BookingCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl text-center">
        
        {/* ক্যানসেলড আইকন */}
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl font-bold animate-bounce">
          ✕
        </div>

        {/* হেডিং */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-3">
          Payment Cancelled
        </h1>

        {/* মেসেজ */}
        <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
          Your booking process was incomplete or cancelled. No amount has been deducted from your account. If this was a mistake, you can safely try booking again.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.back()} 
            className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-3 px-4 rounded-xl shadow-md transition-all duration-200 text-base"
          >
            Try Booking Again
          </button>

          <button
            onClick={() => router.push("/")} 
            className="w-full bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium py-2.5 rounded-xl transition-colors text-sm"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
          <p className="text-xs text-zinc-400">
            Need help? Contact our support at{" "}
            <a href="mailto:support@example.com" className="text-blue-500 hover:underline">
              support@example.com
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}