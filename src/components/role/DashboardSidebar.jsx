"use client";

import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  LayoutDashboardIcon,
  CalendarCheck,
  UserPlus,
  Heart,
  PlusCircle,
  Dumbbell,
  MessageSquarePlus,
  MessagesSquare,
  UserCheck,
  Receipt,
} from "lucide-react";

import { Button, Drawer } from "@heroui/react";
import { Bars } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import ActiveLink from "../service/ActiveLink";
import { useRouter } from "next/navigation";

const DashboardSideBar = () => {
  const { data: session, isPending } = authClient.useSession();

  const router = useRouter()

  const userMenuItems = [
    { title: "Overview", href: "/dashboard/user", icon: LayoutDashboardIcon },
    {
      title: "Booked Classes",
      href: "/dashboard/user/booked-classes",
      icon: CalendarCheck,
    },
    {
      title: "Apply as Trainer",
      href: "/dashboard/user/apply-trainer",
      icon: UserPlus,
    },
    {
      title: "Favorite Classes",
      href: "/dashboard/user/favorites",
      icon: Heart,
    },
  ];

  const trainerMenuItems = [
    { title: "Overview", href: "/dashboard/trainer", icon: LayoutDashboard },
    {
      title: "Add Class",
      href: "/dashboard/trainer/add-class",
      icon: PlusCircle,
    },
    {
      title: "My Classes",
      href: "/dashboard/trainer/my-classes",
      icon: Dumbbell,
    },
    {
      title: "Add Forum Post",
      href: "/dashboard/trainer/add-forum-post",
      icon: MessageSquarePlus,
    },
    {
      title: "My Forum Posts",
      href: "/dashboard/trainer/my-forum-posts",
      icon: MessagesSquare,
    },
  ];

  const adminMenuItems = [
    { title: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    {
      title: "Manage Users",
      href: "/dashboard/admin/manage-users",
      icon: Users,
    },
    {
      title: "Applied Trainers",
      href: "/dashboard/admin/applied-trainers",
      icon: UserCheck,
    },
    {
      title: "Manage Trainers",
      href: "/dashboard/admin/manage-trainers",
      icon: ShieldCheck,
    },
    {
      title: "Manage Classes",
      href: "/dashboard/admin/manage-classes",
      icon: Dumbbell,
    },
    {
      title: "Add Forum Post",
      href: "/dashboard/admin/add-forum-post",
      icon: MessageSquarePlus,
    },
    {
      title: "Forum Post Manage",
      href: "/dashboard/admin/manage-forum-posts",
      icon: MessagesSquare,
    },
    {
      title: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Receipt,
    },
  ];

  const navItems =
    session?.user?.role === "admin"
      ? adminMenuItems
      : session?.user?.role === "trainer"
        ? trainerMenuItems
        : userMenuItems;

  if (isPending) {
    return <p className="p-4 text-sm text-muted-foreground">Loading...</p>;
  }

  const user = session?.user;
  const initial = user?.name?.[0]?.toUpperCase();

  const navContent = (
    <nav className="flex flex-col gap-1 min-h-[75vh] pb-10">
      {navItems.map((item) => (
        <ActiveLink
          key={item.title}
          href={item.href}
          style="flex items-center gap-3 rounded px-3 py-3 text-sm transition-colors my-1"
          activeStyle="bg-primary text-white"
          inactiveStyle="text-foreground hover:bg-muted"
        >
          <item.icon className="size-5" />
          <span>{item.title}</span>
        </ActiveLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="min-w-65 hidden lg:block bg-background text-foreground border-r border-border px-2">
        {/* Profile */}
        <div className="flex items-center gap-3 py-3 cursor-pointer" onClick={()=>router.push("/profile")}>
          {user?.image ? (
            <Image
              src={user?.image || "image.png"}
              alt="profile"
              width={44}
              height={44}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <span className="bg-muted w-16 h-16 flex items-center justify-center rounded-full font-bold">
              {initial}
            </span>
          )}

          <div>
            <h3 className="font-medium text-lg">{user?.name}</h3>
            <p className="text-muted-foreground text-sm">
              {session?.user?.role}
            </p>
          </div>
        </div>

        <button className="w-fit px-4 py-1.5 text-xs font-semibold tracking-wide border rounded-md bg-muted text-foreground mb-10">
          PREMIUM ACCOUNT
        </button>

        {navContent}
      </div>

      {/* Mobile Drawer */}
      <Drawer>
        <Button className="lg:hidden my-2 mx-5" variant="secondary">
          <Bars />
          Sidebar
        </Button>

        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog className="bg-background text-foreground mt-20 border-r border-border">
              <Drawer.CloseTrigger />
              <Drawer.Body>{navContent}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
};

export default DashboardSideBar;
