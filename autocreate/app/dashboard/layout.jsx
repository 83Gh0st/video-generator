"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";
import { VideoDataProvider } from "../_context/VideoDataContext"; // Ensure you import VideoDataProvider
import SideNav from "./_components/SideNav";
import Header from "./_components/header";

function DashboardLayout({ children }) {
    return (
        // Wrap children with the VideoDataProvider to make context available
        <VideoDataProvider>
            <div className="flex">
                {/* SideNav for large screens */}
                <div className="hidden md:block h-screen bg-whites fixed mt-[65px]">
                    <SideNav />
                </div>

                {/* Main content area */}
                <div className="md:ml-64 flex flex-col w-full">
                    <Header />
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </VideoDataProvider>
    );
}

export default DashboardLayout;
