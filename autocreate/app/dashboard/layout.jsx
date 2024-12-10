"use client";
import React, { useState } from "react";
import Header from "./_components/header";
import SideNav from "./_components/SideNav";
import { VideoDataContext } from "../_context/VideoDataContext";

function DashboardLayout({ children }) {
    const [videoData, setVideoData] = useState([]);
    
    return (
        <VideoDataContext.Provider value={{ videoData, setVideoData }}>
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
        </VideoDataContext.Provider>
    );
}

export default DashboardLayout;
