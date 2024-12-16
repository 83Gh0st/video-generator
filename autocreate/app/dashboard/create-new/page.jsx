"use client";

import React, { useContext, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import { Button } from "@/components/ui/button";
import SelectDuration from "./_components/SelectDuration";
import axios from "axios";
import CustomLoading from "./_components/CustomLoading";
import { useUser } from "@clerk/nextjs";
import PlayerDialog from "../_components/PlayerDialog";
import { VideoDataContext } from "@/app/_context/VideoDataContext";

function CreateNew() {
    const [formData, setFormData] = useState({
        duration: "",
        topic: "",
        imagestyle: "",
    });
    const [loading, setLoading] = useState(false);
    const [playVideo, setPlayVideo] = useState(false);
    const [videoId, setVideoId] = useState(null);

    const { videoData, setVideoData } = useContext(VideoDataContext); // Correct destructuring
    const { user } = useUser();

    // Update input fields
    const onHandleInputChange = (fieldName, fieldValue) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: fieldValue,
        }));
    };

    const onCreateClickHandler = () => {
        GetVideoScript();
    };

    const GetVideoScript = async () => {
        try {
            if (!formData.duration || !formData.topic || !formData.imagestyle) {
                alert("Please complete all fields before creating the video.");
                return;
            }

            setLoading(true);

            // Step 1: Generate Video Script
            const scriptPrompt = `Write a script to generate a ${formData.duration} video on the topic: "${formData.topic}" along with AI image prompts in ${formData.imagestyle} format for each scene. Provide the result in JSON format with fields: "ImagePrompt" and "ContentText".`;

            const scriptResponse = await axios.post("/api/get-video-script", { prompt: scriptPrompt });
            const videoScript = scriptResponse.data.result;

            setVideoData((prev) => ({ ...prev, videoScript }));

            // Step 2: Generate TTS
            const googleDriveLink = await generateTTS(videoScript);
            setVideoData((prev) => ({ ...prev, googleDriveLink }));

            // Step 3: Generate Captions
            const captions = await GenerateAudioCaption(googleDriveLink);
            setVideoData((prev) => ({ ...prev, captions }));

            // Step 4: Generate Images
            const imageUrls = await GenerateImage(videoScript);
            setVideoData((prev) => ({ ...prev, imageUrls }));

            // Step 5: Mark as ready for save
            setVideoData((prev) => ({
                ...prev,
                readyForSave:
                    videoScript.length > 0 &&
                    googleDriveLink &&
                    captions &&
                    imageUrls?.length > 0,
            }));
        } catch (error) {
            console.error("Error in GetVideoScript:", error);
            alert("An error occurred while generating video data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Automatically save when video data is ready
    useEffect(() => {
        if (videoData.readyForSave) {
            saveVideoData(videoData);
        }
    }, [videoData.readyForSave]);

    const saveVideoData = async (videoData) => {
        setLoading(true);
        console.log("Final videoData before insert:", JSON.stringify(videoData, null, 2));

        try {
            const payload = {
                script: videoData.videoScript,
                audioFileUrl: videoData.googleDriveLink,
                captions: videoData.captions,
                imageList: videoData.imageUrls,
                createdBy: user?.primaryEmailAddress?.emailAddress || "Unknown User",
            };

            console.log("Payload being sent to API:", payload);

            const response = await fetch('/api/save-database', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error("Response failed with status:", response.status, response.statusText);
                const error = await response.json();
                console.error("Error details:", error.error);
                return;
            }

            const result = await response.json();
            console.log("Insert result:", result);

            if (result?.id) {
                setVideoId(result.id);
            } else {
                console.error("No valid ID returned from insert operation.");
            }
        } catch (error) {
            console.error("Error saving video data:", error.message);
            console.error("Stack trace:", error.stack);
        } finally {
            setLoading(false);

            if (videoData?.audioFileUrl) {
                setPlayVideo(true);
            }
        }
    };

    const generateTTS = async (videoScriptData) => {
        // Validate input data
        if (!videoScriptData || !Array.isArray(videoScriptData) || videoScriptData.length === 0) {
            console.error("No valid video script data available.");
            alert("Failed to process TTS. No script data.");
            return;
        }

        let script = "";
        videoScriptData.forEach((item) => {
            if (item.ContentText) {
                script += `${item.ContentText} `;
            }
        });

        script = script.trim();

        if (typeof script !== 'string' || script.length === 0) {
            console.error("The script is empty or invalid.");
            alert("Failed to generate TTS. No valid script content.");
            return;
        }

        const requestPayload = { text: script, id: "unique-id" };

        try {
            const final_response = await axios.post("/api/generate-audio", requestPayload);
            if (final_response.data?.googleDriveLink) {
                return final_response.data.googleDriveLink;
            }
        } catch (error) {
            console.error("Error generating TTS audio:", error);
        }
    };

    const GenerateAudioCaption = async (googleDriveLink) => {
        if (!googleDriveLink) {
            return alert("Failed to generate captions. No audio file path provided.");
        }

        try {
            const response = await axios.post('/api/generate-captions', { googleDriveLink });
            return response.data;
        } catch (error) {
            console.error("Error generating captions:", error);
        }
    };

    const GenerateImage = async (videoScript) => {
        if (!videoScript || videoScript.length === 0) {
            console.error("videoScript is empty or undefined.");
            return null;
        }

        setLoading(true);

        try {
            const promises = videoScript
                .filter((element) => element?.ImagePrompt)
                .map((element) =>
                    axios.post("/api/generate-image", { prompt: element.ImagePrompt })
                );

            const results = await Promise.allSettled(promises);

            const images = results
                .filter((result) => result.status === "fulfilled" && result.value?.data?.imagePath)
                .map((result) => result.value.data.imagePath);

            if (images.length === 0) {
                return null;
            }

            setVideoData((prev) => ({ ...prev, imageUrls: images }));

            return images;
        } catch (error) {
            console.error("Error generating images:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:px-20">
            <h2 className="font-bold text-4xl text-primary text-center">Create New</h2>
            <div className="mt-10 shadow-md p-10">
                <SelectTopic onUserSelect={onHandleInputChange} />
                <SelectStyle onUserSelect={onHandleInputChange} />
                <SelectDuration onUserSelect={onHandleInputChange} />
                <Button className="mt-10 w-full" onClick={onCreateClickHandler}>
                    Create Video
                </Button>
            </div>

            <CustomLoading loading={loading} />
            <PlayerDialog playVideo={playVideo} videoId={videoId} />
        </div>
    );
}

export default CreateNew;
