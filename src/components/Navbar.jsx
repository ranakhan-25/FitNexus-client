"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ThemeToggle from "./shared/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter()
  const user = session?.user;
  const UserWord = session?.user?.name[0].toUpperCase();


  const links = [
    { name: "Home", href: "/" },
    { name: "Classes", href: "/classes" },
    { name: "Community Forum", href: "/forum" },
  ];

  const dashBoardLink = {
    user: "/dashboard/user",
    trainer: "/dashboard/trainer",
    admin: "/dashboard/admin",
  };

  if (user?.email) {
    links.push({
      name: "Dashboard",
      href: dashBoardLink[user?.role || "user"],
    });
  }

  const handelProfile = () => {
    router.push("/profile")
    setOpen(false)
  }
  const handelLogOut = async () => {
    const result = await authClient.signOut();
    if (result) {
      toast("LogOut Successfully")
      router.push("/unauthorized")
    }
    if (!result) {
      toast("LogOut is Filed !")
    }
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/60">
      <div className="max-w-7xl mx-auto px-5">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Dumbbell className="text-green-500" />
            <span className="font-bold text-2xl">FitNexus</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="relative py-2">
                <span
                  className={`transition-colors ${
                    pathname === link.href
                      ? "text-green-500"
                      : "hover:text-green-500"
                  }`}
                >
                  {link.name}
                </span>

                {pathname === link.href && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-green-500"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {
              !isPending ? user ? <div onClick={handelProfile} className=" cursor-pointer">
                {
                  user?.image ? <Image src={user?.image || "https://i.ibb.co.com/bM2cWSNY/fevicon-icon.jpg"} alt={user?.name} width={25} height={25} className="rounded-full w-10 h-10"/> : <p>{UserWord}</p>
                }
              </div> : <Link
              href="/login"
              className="px-4 py-2 rounded-lg border hover:scale-105 transition"
            >
              Login
            </Link> : <p>Loading...</p>
            }
            

            {
              user ? <button className="px-4 py-2 rounded-lg bg-green-500 text-white hover:scale-105 transition"  onClick={handelLogOut}>LogOut</button> : <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:scale-105 transition"
            >
              Register
            </Link>
            }
          </div>

          {/* Mobile Button */}
          <button onClick={() => setOpen(!open)} className="md:hidden">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t bg-white dark:bg-black"
          >
            <div className="flex flex-col p-5 gap-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`${
                    pathname === link.href ? "text-green-500 font-semibold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <ThemeToggle />

              {
                !isPending ? user ? <div>
                  {
                    user?.image ? <div onClick={handelProfile} className="flex items-center gap-2 cursor-pointer">
                      <Image src={user?.image || "https://i.ibb.co.com/bM2cWSNY/fevicon-icon.jpg"} alt={user?.name} width={25} height={25} className="rounded-full w-10 h-10" />
                      <h1 className="font-bold text-xl">{user?.name}</h1>
                  </div> : <p>{UserWord}</p>
                }
                </div> : <Link
                href="/login"
                className="border rounded-lg py-2 text-center"
              >
                Login
              </Link> : <p>Loading...</p>
              }

              {
                user ? <button onClick={handelLogOut} className="bg-green-500 text-white rounded-lg py-2 text-center">SignOut</button> : <Link
                href="/register"
                className="bg-green-500 text-white rounded-lg py-2 text-center"
              >
                Register
              </Link>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
