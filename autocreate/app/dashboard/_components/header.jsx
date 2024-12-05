import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
function Header(){
    return (
        <div className="p-3 px-5 flex items-center justify-between shadow-md">
            
            <div className="flex gap-3 items-center">
                <Image src={'/logo.jpg'} width={60} height={60} alt="logo"/>
                <h2 className="font-bold text-xl">AutoCreate </h2>
            </div>
            <div className="flex gap-3  items-center">
                <Button>Dashboard</Button>
                <UserButton/>
            </div>
             </div>
    )
}

export default Header;