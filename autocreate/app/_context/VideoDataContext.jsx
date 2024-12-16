// _context/VideoDataContext.js
import React, { createContext, useState } from 'react';

export const VideoDataContext = createContext();

export const VideoDataProvider = ({ children }) => {
    const [videoData, setVideoData] = useState({
        videoScript: [],
        googleDriveLink: "",
        captions: null,
        imageUrls: [],
        readyForSave: false,
    });

    return (
        <VideoDataContext.Provider value={{ videoData, setVideoData }}>
            {children}
        </VideoDataContext.Provider>
    );
};
