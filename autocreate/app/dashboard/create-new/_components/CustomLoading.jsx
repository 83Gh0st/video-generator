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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden if you want to hide the title visually

function CustomLoading({loading}) {
    return (
        <AlertDialog open={loading}>
            <AlertDialogContent className="bg-white rounded-border">
                <AlertDialogHeader>
                    {/* Add AlertDialogTitle for accessibility */}
                    <AlertDialogTitle>
                        <VisuallyHidden>Loading Video Generation</VisuallyHidden>
                    </AlertDialogTitle>
                </AlertDialogHeader>
                
                <div className="bg-white flex flex-col items-center my-10 justify-center">
                    <Image src={'/progress.gif'} width={100} height={100} alt="loading"/>
                    <h2>Generating the Video.. Do not Refresh.</h2>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default CustomLoading;
