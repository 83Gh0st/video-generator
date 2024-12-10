"use client";

import Image from "next/image";
import React, { useState } from "react";

function SelectStyle({ onUserSelect }) {
    const styleOptions = [
        { name: "Realistic", image: "/realistic.jpg" },
        { name: "Cartoon", image: "/cartoon.jpg" },
        { name: "Comic", image: "/comic.jpg" },
        { name: "WaterColor", image: "/watercolor.jpg" },
        { name: "GTA", image: "/gta.jpg" },
    ];

    const [selectedOption, setSelectedOption] = useState(styleOptions[0]?.name || "");

    const handleStyleSelect = (styleName) => {
        setSelectedOption(styleName);
        onUserSelect("imagestyle", styleName);
    };

    return (
        <div className="mt-7">
            <h2 className="font-bold text-2xl text-primary">Style</h2>
            <p className="text-gray-500">Select the video style.</p>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {styleOptions.map((item, index) => (
                    <div
                        key={index}
                        className={`relative hover:scale-105 transition-all cursor-pointer rounded-xl overflow-hidden ${
                            selectedOption === item.name ? "border-4 border-primary" : "border border-gray-300"
                        }`}
                        onClick={() => handleStyleSelect(item.name)} // Handle click at parent level
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="h-32 object-cover w-full"
                        />
                        <h2
                            className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-center text-sm py-1`}
                        >
                            {item.name}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SelectStyle;
