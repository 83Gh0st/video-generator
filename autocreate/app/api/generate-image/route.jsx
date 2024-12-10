// /app/api/generate-image/route.js
import { execFile } from "child_process";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
    // Parse the incoming request body
    const { prompt } = await req.json();  // `req.json()` parses the body to JSON

    if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const scriptPath = path.resolve("/home/cpow/Desktop/video-generator-1/autocreate/app/api/scripts/generate_image.py");

    return new Promise((resolve, reject) => {
        execFile("python3", [scriptPath, prompt], (error, stdout, stderr) => {
            if (error) {
                console.error("Error executing Python script:", stderr);
                return reject(new Error('Failed to generate image'));
            }

            // Read the image path from the Python script's output
            const imagePath = stdout.trim();
            console.log("Generated Image Path:", imagePath);

            // Return the image path in the response to frontend
            resolve(NextResponse.json({ imagePath }, { status: 200 }));
        });
    });
}
