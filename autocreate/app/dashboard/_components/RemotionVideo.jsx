import React, { useState, useEffect } from "react";
import { AbsoluteFill, Audio, Img, Sequence, useCurrentFrame, useVideoConfig } from "remotion";

function RemotionVideo({ script, imageList, audioFileUrl, captions }) {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();
    const [durationInFrames, setDurationInFrames] = useState(0);

    useEffect(() => {
        // Calculate the total duration in frames and set it
        const totalDuration = (captions[captions?.length - 1]?.end / 1000) * fps;
        setDurationInFrames(totalDuration);
    }, [captions, fps]);

    const getCurrentCaptions = () => {
        const currentTime = (frame / fps) * 1000; // Convert frame to milliseconds
        const currentCaption = captions.find(
            (word) => currentTime >= word.start && currentTime <= word.end
        );
        return currentCaption ? currentCaption?.text : "";
    };

    const durationPerImage = durationInFrames / imageList?.length;

    return (
        <AbsoluteFill className="bg-black">
            {/* Render Image Sequences */}
            {imageList?.map((item, index) => 
            {return(
                <Sequence
                    key={index}
                    from={Math.round(index * durationPerImage)}
                    durationInFrames={Math.round(durationPerImage)}
                >
                    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                        <Img
                            src={item}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                        <AbsoluteFill
                            style={{
                                color: "white",
                                justifyContent: "center",
                                alignItems: "center",
                                bottom: 50,
                                height: 150,
                                textAlign: "center",
                                width: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                            }}
                        >
                            <h2 style={{ fontSize: "24px", margin: 0 }}>{getCurrentCaptions()}</h2>
                        </AbsoluteFill>
                    </AbsoluteFill>
                </Sequence>
            )})}

            {/* Add Background Audio */}
            <Audio src={audioFileUrl} />
        </AbsoluteFill>
    );
}

export default RemotionVideo;