"use client";

import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function SelectDuration({ onUserSelect }) {
    const durationOptions = [
        { label: "15 Seconds", value: "15 seconds" },

        { label: "30 Seconds", value: "30 seconds" },
        { label: "60 Seconds", value: "60 seconds" },

    ];

    const [selectedOption, setSelectedOption] = useState("");

    const handleDurationSelect = (value) => {
        setSelectedOption(value);
        onUserSelect("duration", value);
    };

    return (
        <div className="mt-7">
            <h2 className="font-bold text-2xl text-primary">Duration</h2>
            <p className="text-gray-500">Select the duration of your video.</p>

            <Select
                onValueChange={handleDurationSelect}
            >
                <SelectTrigger className="w-full mt-2 p-6 text-lg">
                    <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                    {durationOptions.map((option, index) => (
                        <SelectItem key={index} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default SelectDuration;
