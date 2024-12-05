"use client";

import React, { useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import { Button } from "@/components/ui/button";
import SelectDuration from "./_components/SelectDuration";

function CreateNew() {
    const [formData, setFormData] = useState({});

    const onHandleInputChange = (fieldName, fieldValue) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: fieldValue,
        }));
    };

    return (
        <div className="md:px-20">
            <h2 className="font-bold text-4xl text-primary text-center">Create New</h2>

            <div className="mt-10 shadow-md p-10">
                <SelectTopic onUserSelect={onHandleInputChange} />
                <SelectStyle onUserSelect={onHandleInputChange} />
                <SelectDuration  onUserSelect={onHandleInputChange}/>
                <Button className="mt-10 w-full">Create Video</Button>
            </div>

            
        </div>
    );
}

export default CreateNew;
