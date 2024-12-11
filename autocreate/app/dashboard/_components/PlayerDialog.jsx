import React, { useEffect, useState } from "react";
import { Player } from "@remotion/player";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import RemotionVideo from "./RemotionVideo";
import { Button } from "@/components/ui/button";
import { VideoData } from "@/config/schema";
  

function PlayerDialog({playVideo,videoId}){
    const [openDialog,setOpenDialog]=useState(false);
    const [videoData,setVideoData] =useState();
    const [durationInFrame,setDurationInFrame]=useState(100);
    useEffect(()=>{
        setOpenDialog(playVideo)
        videoId&&GetVideoData();
    },[playVideo])

    const GetVideoData=async()=>{
        const result = await db.select().from(VideoData)
        .where(eq(VideoData.id,videoId));

        console.log(result[0]);
    }
    return (
        <Dialog open={openDialog}>
        <DialogContent className="bg-white flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold my-5">Your Video is ready.</DialogTitle>
            <DialogDescription>
            <Player
      component={RemotionVideo}
      durationInFrames={durationInFrame}
      compositionWidth={300}
      compositionHeight={450}
      fps={30}
      controls={true}
      inputProps={{
        ...videoData,
        setDurationInFrames:(frameValue)=>setDurationInFrame(frameValue)
      }

      }
    />
    <div className="flex gap-10 mt-10">
        <Button varient="ghost">Cancel</Button>
        <Button>Export</Button>
    </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
    )
}


export default PlayerDialog;