"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function Banner() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Transform Your Body,
              <span className="text-green-500 block">Elevate Your Life</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-6 text-lg text-gray-600 dark:text-gray-300"
            >
              Join FitNexus and discover expert-led fitness classes, connect
              with professional trainers, track your progress, and become part
              of a thriving fitness community.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/classes"
                className="px-8 py-4 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition shadow-lg"
              >
                Explore Classes
              </Link>

              {!user && (
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Join Now
                </Link>
              )}
            </motion.div>
          </div>

          {/* Banner Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Image
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200"
              alt="Fitness Training"
              width={1200}
              height={800}
              className="rounded-3xl shadow-2xl w-full object-cover"
            />

            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-4">
              <h3 className="font-bold text-xl">500+</h3>
              <p className="text-sm text-gray-500">Active Members</p>
            </div>

            <div className="absolute -top-6 -right-6 bg-green-500 text-white shadow-xl rounded-2xl p-4">
              <h3 className="font-bold text-xl">50+</h3>
              <p className="text-sm">Expert Trainers</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
