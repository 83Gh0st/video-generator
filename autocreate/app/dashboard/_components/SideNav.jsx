"use client";
import { CircleUser, FileVideo, PanelsTopLeft, ShieldPlus } from "lucide-react";
import Link from "next/link"; // Import Link from Next.js
import { usePathname } from "next/navigation"; // For dynamic path detection
import React from "react";

function SideNav() {
  const MenuOption = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: PanelsTopLeft,
    },
    {
      id: 2,
      name: "Create New",
      path: "/dashboard/create-new",
      icon: FileVideo,
    },
    {
      id: 3,
      name: "Upgrade",
      path: "/upgrade",
      icon: ShieldPlus,
    },
    {
      id: 4,
      name: "Account",
      path: "/account",
      icon: CircleUser,
    },
  ];

  const pathname = usePathname(); // Get the current path

  return (
    <div className="w-64 h-screen shadow-md p-5">
      <div className="grid gap-3 mb-4">
        {MenuOption.map((item) => (
          <Link href={item.path} key={item.id}>
            <div
              className={`flex items-center space-x-2 gap-3 p-3
              hover:bg-primary hover:text-white rounded-md cursor-pointer
              ${pathname === item.path ? "bg-primary text-white" : ""}
              `}
            >
              <item.icon className="w-6 h-6 " />
              <h2 >{item.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SideNav;
