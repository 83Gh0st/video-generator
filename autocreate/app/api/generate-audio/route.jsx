import { execFile } from "child_process";
import path from "path";
import { NextResponse } from "next/server";

// Export the POST handler
export async function POST(req) {
    try {
        // Get request body data
        const { text, id } = await req.json();

        // Validate request body
        if (!text || text.trim() === "") {
            return NextResponse.json({ error: "Text is required for TTS." }, { status: 400 });
        }

        // Path to your Python script
        const scriptPath = path.resolve(process.cwd(), "app/api/scripts/generate_tts.py");

        // Execute the Python script
        const final_response = await new Promise((resolve, reject) => {
            execFile("python3", [scriptPath, text], (error, stdout, stderr) => {
                if (error) {
                    console.error("Execution Error:", error.message);
                    return reject("Failed to execute TTS script.");
                }
                if (stderr) {
                    console.error("Script Error Output:", stderr);
                    return reject(stderr.trim());
                }

                console.log("Python stdout:", stdout); // Log stdout

                // Try parsing the Python script output as JSON
                try {
                    const jsonResponse = JSON.parse(stdout.trim());
                    resolve(jsonResponse);
                } catch (parseError) {
                    console.error("JSON Parse Error:", parseError.message);
                    console.error("Script Output:", stdout); // Log the raw output for debugging
                    reject("Error parsing script response. Ensure the script returns valid JSON.");
                }
            });
        });

        // Validate the JSON response structure
        if (
            final_response.success &&
            final_response.filePath &&
            final_response.google_drive_link &&
            final_response.file_io_link
        ) {
            // Return the response including the file links and other information
            return NextResponse.json({
                success: true,
                filePath: final_response.filePath,
                googleDriveLink: final_response.google_drive_link,
                fileIoLink: final_response.file_io_link,
                id,
            });
        } else {
            console.error("Unexpected script response:", final_response);
            return NextResponse.json({ error: "Backend did not return expected data." }, { status: 500 });
        }
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}
