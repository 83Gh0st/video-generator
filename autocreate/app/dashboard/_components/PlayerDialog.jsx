import React, { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import RemotionVideo from "./RemotionVideo";
import { Button } from "@/components/ui/button";
import axios from "axios";

function PlayerDialog({ playVideo, videoId }) {
    const [openDialog, setOpenDialog] = useState(playVideo); // Sync dialog state with playVideo prop
    const [videoData, setVideoData] = useState(null); // State to store fetched video data
    const [durationInFrames, setDurationInFrames] = useState(100); // Default duration

    // Sync openDialog state with playVideo prop
    useEffect(() => {
        setOpenDialog(playVideo);
    }, [playVideo]);

    useEffect(() => {
        const fetchVideoData = async () => {
            if (!videoId) return; // Exit early if videoId is not defined
    
            try {
                console.log(`Fetching video data for ID: ${videoId}`);
                const data = await axios.get(`/api/retrive-data/${videoId}`);
                console.log(data.data); // The video data from the API
    
                // Use the response data directly from axios
                setVideoData(response.data); // Store the fetched data in state
            } catch (error) {
                console.error("Error fetching video data:", error.message);
            }
        };
    
        fetchVideoData();
    }, [videoId]); // Trigger when videoId changes
    


    // Handle loading state while fetching video data
    if (!videoData) {
        return null; // Render nothing while loading
    }

    return (
        <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
            <DialogContent className="bg-white flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold my-5">
                        Your Video is Ready
                    </DialogTitle>
                    <DialogDescription>
                        <Player
                            component={RemotionVideo}
                            durationInFrames={durationInFrames} // Pass controlled duration
                            compositionWidth={300}
                            compositionHeight={450}
                            fps={30}
                            controls={true}
                            inputProps={{
                                ...videoData, // Spread video data for RemotionVideo
                            }}
                        />
                        <div className="flex gap-10 mt-10">
                            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                            <Button>Export</Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default PlayerDialog;
