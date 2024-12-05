import React from "react";
import Image from "next/image";
function Header(){
    return (
        <div>
            
            <div className="flex gap-3 items-center">
                <Image src={'/logo.jpg'} width={60} height={60} alt="logo"/>
                <h2 className="font-bold text-xl">AutoCreate </h2>
            </div>
             </div>
    )
}

export default Header;