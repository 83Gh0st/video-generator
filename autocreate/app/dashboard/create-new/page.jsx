"use client";

import React, { useContext, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import { Button } from "@/components/ui/button";
import SelectDuration from "./_components/SelectDuration";
import axios from "axios";
import CustomLoading from "./_components/CustomLoading";
import { v4  as uuidv4 } from 'uuid';
import { fileURLToPath } from "url";
import { VideoDataContext } from "@/app/_context/VideoDataContext";

function CreateNew() {
    const [formData, setFormData] = useState({
        duration: "",
        topic: "",
        imagestyle: "",
    });
    const [loading, setLoading] = useState(false);
    const [videoScript, setVideoScript] = useState([]);
    const [captions,setCaptions]=useState();
    const [imageList,setImageList] =useState();
    const {videoData,setVideoData} =useContext(VideoDataContext);
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
        if (!formData.duration || !formData.topic || !formData.imagestyle) {
            console.error("Missing required fields in formData:", formData);
            return alert("Please complete all fields before creating the video.");
        }
    
        const prompt = `Write a script to generate a ${formData.duration} video on the topic: "Interesting Historical Facts" along with AI image prompts in ${formData.imagestyle} format for each scene. Provide the result in JSON format with fields: "ImagePrompt" and "ContentText".`;
    
        try {
            setLoading(true);
    
            const result = await axios.post("/api/get-video-script", { prompt });
    
            if (!result.data || !Array.isArray(result.data.result)) {
                console.error("Unexpected response format:", result);
                setLoading(false);
                return alert("Invalid response from server. Please try again.");
            }
    
            const videoScript = result.data.result;
            setVideoScript(videoScript);
            setVideoData(prev => ({
                ...prev,
                'videoScript': videoScript
            }));
    
            // Generate TTS and get the local path to the audio file
            const googleDriveLink = await generateTTS(videoScript);
            setVideoData(prev => ({
                ...prev,
                'googleDriveLink': googleDriveLink
            }));
    
            if (googleDriveLink) {
                try {
                    // Generate captions using the audio file path
                    const captions = await GenerateAudioCaption(googleDriveLink);
                    console.log("Generated Captions Object:", captions);
                    setCaptions(captions);
                    setVideoData(prev => ({
                        ...prev,
                        'captions': captions
                    }));
                } catch (error) {
                    console.error("Error generating captions:", error);
                    alert("Failed to generate captions. Please try again later.");
                }
            } else {
                console.error("Audio file path is not available.");
                alert("Failed to generate captions. TTS audio not found.");
            }
        } catch (error) {
            console.error("Error fetching video script or processing audio:", error);
            setLoading(false);
            alert("Failed to generate video script or process audio. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    
    // UseEffect to trigger image generation only after videoScript is set
    useEffect(() => {
        if (videoScript && videoScript.length > 0) {
            GenerateImage();
        } else {
            console.error("Video script is empty or not generated correctly.");
        }
    }, [videoScript]); // Only run when videoScript is updated
    
    
    
    
    
    
    
    const generateTTS = async (videoScriptData) => {
        // Validate input data
        if (!videoScriptData || !Array.isArray(videoScriptData) || videoScriptData.length === 0) {
            console.error("No valid video script data available.");
            alert("Failed to process TTS. No script data.");
            return;
        }
    
        // Concatenate content text from the data
        let script = "";
        const id = uuidv4(); // Generate a unique ID for this request
    
        videoScriptData.forEach((item) => {
            if (item.ContentText) {
                // Ensure each piece of content is treated as a valid string
                script += `${item.ContentText} `;
            }
        });
    
        script = script.trim(); // Remove trailing spaces
        console.log("Trimmed script for TTS:", script);
    
        // Check if the script is a valid non-empty string
        if (typeof script !== 'string' || script.length === 0) {
            console.error("The script is empty or invalid.");
            alert("Failed to generate TTS. No valid script content.");
            return;
        }
    
        // Ensure the script is wrapped in quotes and properly formatted
        const requestPayload = {
            text: script,  // This ensures the text is passed as a properly formatted string
            id: id, // Send unique ID to backend
        };
    
        try {
            // Send request to the backend to generate TTS
            const final_response = await axios.post("/api/generate-audio", requestPayload);
            
            console.log("TTS generation response--------:", final_response.data);
    
            if (final_response.data && final_response.data.googleDriveLink) {
                const googleDriveLink = final_response.data.googleDriveLink; // Google Drive link
    
                console.log("Google Drive link:", googleDriveLink);
    
                // Return the Google Drive link to the caller
                return googleDriveLink;
            } else {
                throw new Error("Backend did not return expected filePath or google_drive_link.");
            }
        } catch (error) {
            console.error("Error generating TTS audio:", error.message || error);
            alert("Failed to generate TTS. Please try again.");
        }
    };
    
    
    
    const GenerateAudioCaption = async (googleDriveLink) => {
        console.log("Audio file path being sent:----", googleDriveLink); // Log the file path for debugging
    
        if (!googleDriveLink) {
            console.error("Audio file path is missing.");
            return alert("Failed to generate captions. No audio file path provided.");
        }
    
        try {
            console.log("Sending request to generate captions...");
            const response = await axios.post('/api/generate-captions', {
                googleDriveLink: googleDriveLink, // Send the audio file path to the backend
            });
    
            console.log("Response received from backend:", response.data);
            return response.data;
            
        } catch (error) {
            console.error("Error generating captions:", error.response ? error.response.data : error.message);
    
            // Provide a meaningful error message based on the error type
            if (error.response && error.response.data && error.response.data.error) {
                alert(`Error: ${error.response.data.error}`);
            } else {
                alert("Error while generating captions. Please try again.");
            }
        }
    };
    
    
    
    const GenerateImage = async () => {
        if (!videoScript || videoScript.length === 0) {
            console.error("videoScript is empty or undefined.");
            return;
        }
    
        setLoading(true);
    
        try {
            // Create promises for each API call
            const promises = videoScript
                .filter((element) => element?.ImagePrompt) // Filter out invalid prompts
                .map((element) =>
                    axios.post('/api/generate-image', {
                        prompt: element.ImagePrompt,
                    })
                );
    
            // Use Promise.allSettled to handle partial failures
            const results = await Promise.allSettled(promises);
    
            // Log the entire results array for debugging
            console.log("All results:", results);
    
            // Extract successful results and check for the correct imagePath
            const images = results
                .filter((result) => result.status === "fulfilled") // Keep only successful results
                .map((result) => {
                    if (result.value?.data?.imagePath) {
                        return result.value.data.imagePath; // Extract valid image URLs
                    } else {
                        console.warn("Missing imagePath in response:", result.value);
                        return undefined; // Handle missing imagePath gracefully
                    }
                })
                .filter((url) => url !== undefined); // Remove undefined values
    
            // Log all extracted image URLs to the console
            console.log("Generated Image URLs:", images);
    
            // Update state with the new list of image URLs
            setImageList(images);
            setVideoData(prev => ({
                ...prev,
                'imageUrls': images // directly use the `images` array here
             }));
             
        } catch (error) {
            console.error("Error generating images:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(()=>{
        console.log(videoData);
    },[videoData])
    
    
    
    
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
        </div>
    );
}

export default CreateNew;
