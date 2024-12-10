import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function EmptyState(){
    return (

        <div className="p-3 py-20 flex items-center flex-col mt-6 border-2 border-dotted">
            <h2>You don't have any AI generated videos at the moment.</h2>
            <Link href={'/dashboard/create-new'}>
            <Button>Create a Video</Button>
            </Link>
        </div>

    )
}

export default EmptyState