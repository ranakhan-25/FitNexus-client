"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink = ({ href, children, style = "" }) => {
  const pathname = usePathname();

  const isActive =
    href === "/dashboard/user"
      ? pathname === "/dashboard/user"
      : href === "/dashboard/trainer"
      ? pathname === "/dashboard/trainer"
      : href === "/dashboard/admin"
      ? pathname === "/dashboard/admin"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`${
        isActive
          ? "bg-green-200 text-black"
          : "text-foreground hover:bg-default"
      } ${style}`}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;