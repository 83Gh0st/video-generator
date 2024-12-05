"use client";
import Image from "next/image";
import React, { useState } from "react";

function SelectStyle({onUserSelect}) {
    const styleOptions = [
        { name: "Realistic", image: "/realistic.jpg" },
        { name: "Cartoon", image: "/cartoon.jpg" },
        { name: "Comic", image: "/comic.jpg" },
        { name: "WaterColor", image: "/watercolor.jpg" },
        { name: "GTA", image: "/gta.jpg" },
       
    ];

    const [selectedOption, setSelectedOption] = useState(styleOptions[0]?.name || "");

    return (
        <div className="mt-7">
            <h2 className="font-bold text-2xl text-primary">Style</h2>
            <p className="text-gray-500">Select the video Style.</p>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {styleOptions.map((item, index) => (
                    <div
                        key={index}
                        className={`relative hover:scale-105 transition-all cursor-pointer rounded-xl 
                        ${selectedOption === item.name ? "border-4 border-primary" : ""}`}
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="h-50 object-cover rounded-lg w-full"
                            onClick={()=>{
                                setSelectedOption(item.name)
                                onUserSelect('imageStyle',item.name)
                            }}
                        />
                        <h2 className="absolute p-1 bg-black text-white text-center rounded-b-lg bottom-0 w-full">
                            {item.name}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SelectStyle;
