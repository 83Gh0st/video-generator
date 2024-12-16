"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";

function Dashboard() {
    const [videoList, setVideoList] = useState([]);

    // Example of fetching video list (you should replace this with actual API call or DB fetching)
    useEffect(() => {
        // Simulate fetching data from an API or database
        const fetchVideoList = async () => {
            try {
                // Replace with an actual API request
                const response = await fetch("/api/get-videos");
                const data = await response.json();
                setVideoList(data.videos); // Assuming data.videos is the array of video objects
            } catch (error) {
                console.error("Error fetching video list:", error);
            }
        };

        fetchVideoList();
    }, []); // Empty dependency array means it runs once when the component is mounted

    return (
        <div>
            <div className="flex items-center justify-between p-3">
                <h2 className="font-bold text-2xl text-primary">Dashboard</h2>
                <Link href="/dashboard/create-new">
                    <Button>+Create New</Button>
                </Link>
            </div>

            {/* Empty state */}
            {videoList.length === 0 ? (
                <div>
                    <EmptyState />
                </div>
            ) : (
                // Render your video list or something else here
                <div>
                    {/* Example video list rendering */}
                    <ul>
                        {videoList.map((video, index) => (
                            <li key={index}>{video.title}</li> // Customize with actual video properties
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
