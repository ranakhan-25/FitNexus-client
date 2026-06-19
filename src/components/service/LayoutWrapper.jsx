"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideFooter = pathname.startsWith("/dashboard");

  return (
    <>
      <Navbar />
      {children}
      {!hideFooter && <Footer />}
      <ToastContainer />
    </>
  );
}