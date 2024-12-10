import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import Image from "next/image";
  

function CustomLoading({loading}){
    return (
        <AlertDialog open={loading}>
  
  <AlertDialogContent className="bg-white rounded-border"> 
    <div className="bg-white flex flex-col item-center my-10 justify-center">
        <Image src={'/progress.gif'} width={100} height={100} alt="loading"/>
        <h2>Generating the Video.. Do not Refresh.</h2>
    </div>
  </AlertDialogContent>
</AlertDialog>

    )
}

export default CustomLoading;