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
import { VideoData } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import PlayerDialog from "../_components/PlayerDialog";
import { db } from "@/config/db";

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

    const [playVideo,setPlayVideo] =useState(false);
    const [videoId,setVideoId] =useState();
    const {videoData,setVideoData} =useContext(VideoDataContext);
    const {user} =useUser();
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
            // Step 1: Validate Input Fields
            if (!formData.duration || !formData.topic || !formData.imagestyle) {
                console.error("Missing required fields in formData:", formData);
                alert("Please complete all fields before creating the video.");
                return;
            }
    
            setLoading(true);
    
            // Step 2: Generate Video Script
            const prompt = `Write a script to generate a ${formData.duration} video on the topic: "${formData.topic}" along with AI image prompts in ${formData.imagestyle} format for each scene. Provide the result in JSON format with fields: "ImagePrompt" and "ContentText".`;
    
            const scriptResponse = await axios.post("/api/get-video-script", { prompt });
    
            if (!scriptResponse.data || !Array.isArray(scriptResponse.data.result)) {
                console.error("Unexpected response format for video script:", scriptResponse);
                alert("Invalid response from server. Please try again.");
                return;
            }
    
            const videoScript = scriptResponse.data.result;
            setVideoScript(videoScript);
            setVideoData((prev) => ({ ...prev, videoScript }));
    
            // Step 3: Generate Text-to-Speech (TTS)
            const googleDriveLink = await generateTTS(videoScript);
    
            if (!googleDriveLink) {
                console.error("TTS generation failed.");
                alert("Failed to generate TTS audio. Please try again.");
                return;
            }
    
            setVideoData((prev) => ({ ...prev, googleDriveLink }));
    
            // Step 4: Generate Captions
            const captions = await GenerateAudioCaption(googleDriveLink);
    
            if (!captions || captions.length === 0) {
                console.error("Caption generation failed.");
                alert("Failed to generate captions. Please try again.");
                return;
            }
    
            setCaptions(captions);
            setVideoData((prev) => ({ ...prev, captions }));
    
            // Step 5: Generate Images
            const imagesGenerated = await GenerateImage(videoScript);
    
            if (!imagesGenerated) {
                console.error("Image generation failed.");
                alert("Failed to generate images. Please try again.");
                return;
            }
    
            console.log("Images successfully generated:", imagesGenerated);
    
        } catch (error) {
            console.error("Error in GetVideoScript:", error);
            alert("An error occurred while generating video data. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    
    

    
    
    
    
    
    
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
    
    
  
    const GenerateImage = async (videoScript) => {
        if (!videoScript || videoScript.length === 0) {
            console.error("videoScript is empty or undefined.");
            return null; // Explicitly return null to indicate failure
        }
    
        setLoading(true);
    
        try {
            const promises = videoScript
                .filter((element) => element?.ImagePrompt)
                .map((element) =>
                    axios.post("/api/generate-image", { prompt: element.ImagePrompt })
                );
    
            const results = await Promise.allSettled(promises);
    
            console.log("API call results:", results);
    
            const images = results
                .filter((result) => result.status === "fulfilled" && result.value?.data?.imagePath)
                .map((result) => result.value.data.imagePath);
    
            if (images.length === 0) {
                console.warn("No valid images generated.");
                return null; // Return null if no images were successfully generated
            }
    
            setImageList(images);
            setVideoData((prev) => ({
                ...prev,
                imageUrls: images,
            }));
    
            return images; // Return the successfully generated image URLs
        } catch (error) {
            console.error("Error generating images:", error);
            return null; // Return null to indicate failure
        } finally {
            setLoading(false);
        }
    };
    
    
    useEffect(() => {
        console.log(videoData);
        if (Object.keys(videoData).length === 4) {
            saveVideoData(videoData); // Pass videoData explicitly
        }
    }, [videoData]);
    
    
    const saveVideoData = async (videoData) => {
        setLoading(true); // Start loading spinner
        let result = null;
    
        try {
            console.log('Video Data to be saved:', videoData);  // Log the incoming data
    
            // Ensure 'videoScript' is an array and wrap it in an object with 'scriptSteps' property
            if (Array.isArray(videoData.videoScript)) {
                // Assign the videoScript to scriptSteps inside videoData.script
                videoData.script = { scriptSteps: videoData.videoScript };  // Wrap the array into a script object
            }
    
            // If 'videoData.script' is still not set, throw an error
            if (!videoData.script || !Array.isArray(videoData.script.scriptSteps)) {
                throw new Error("Invalid script data. Please provide valid script data as an array.");
            }
    
            // Ensure valid JSON structure for script and captions
            if (typeof videoData.script !== 'object') {
                throw new Error("Invalid script data, expected a JSON object.");
            }
    
            if (typeof videoData.captions !== 'object') {
                throw new Error("Invalid captions data, expected a JSON object.");
            }
    
            // Ensure imageList is an array of strings
            if (!Array.isArray(videoData.imageUrls)) {
                throw new Error("Invalid imageList, expected an array of strings.");
            }
    
            console.log("Preparing data for insertion...");
    
            // Log the final structure before insertion to verify everything
            console.log("Final videoData before insert:", JSON.stringify(videoData, null, 2));
    
            // Insert data into the database
            result = await db
                .insert('VideoData')
                .values({
                    script: videoData.script,  // Save the correctly wrapped script
                    audioFileUrl: videoData.googleDriveLink,  // Ensure valid URL
                    captions: videoData.captions,
                    imageList: videoData.imageUrls,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                })
                .returning('id');
    
            console.log("Insert result:", result);
    
            if (result?.length > 0) {
                setVideoId(result[0].id);  // Set the video ID
            } else {
                console.error("No data returned from insert operation.");
            }
        } catch (error) {
            console.error("Error saving video data:", error.message);
            console.error("Stack trace:", error.stack);  // Log the full stack trace
        } finally {
            setPlayVideo(true);
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
            <PlayerDialog playVideo={playVideo} videoId={videoId}/>
        </div>
    );
}

export default CreateNew;
