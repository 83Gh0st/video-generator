"use client";

import React, { useState, useRef } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function SelectTopic({ onUserSelect }) {
    const options = [
        "Custom Prompt",
        "Random AI Story",
        "Scary Story",
        "Motivational Story",
        "Historical Facts",
        "Bedtime Story",
        "Religious Facts",
    ];
    const [selectedOption, setSelectedOption] = useState("");
    const debounceRef = useRef(null);

    const handleTextareaChange = (e) => {
        const value = e.target.value;
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onUserSelect("topic", value);
        }, 300); // Debounce to avoid frequent updates
    };

    return (
        <div>
            <h2 className="font-bold text-2xl text-primary">Content</h2>
            <p className="text-gray-500">What's the topic for your video?</p>

            <Select
                onValueChange={(value) => {
                    setSelectedOption(value);

                    // Call onUserSelect if not "Custom Prompt"
                    if (value !== "Custom Prompt") {
                        onUserSelect("topic", value);
                    }
                }}
            >
                <SelectTrigger className="w-full mt-2 p-6 text-lg">
                    <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((item, index) => (
                        <SelectItem value={item} key={index}>
                            {item}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Show Textarea for Custom Prompt */}
            {selectedOption === "Custom Prompt" && (
                <Textarea
                    className="mt-3"
                    placeholder="Enter a custom prompt for your video"
                    onChange={handleTextareaChange}
                />
            )}
        </div>
    );
}

export default SelectTopic;
