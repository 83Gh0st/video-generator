import { NextResponse } from 'next/server';
import axios from 'axios';

// Function to transcribe audio from a Google Drive direct download link
async function transcribeFromGoogleDriveLink(googleDriveLink) {
    try {
        console.log('Sending transcription request to AssemblyAI...');
        
        // Send transcription request to AssemblyAI
        const response = await axios.post(
            'https://api.assemblyai.com/v2/transcript',
            { audio_url: googleDriveLink }, // Pass the direct download link
            {
                headers: {
                    authorization: process.env.ASSEMBLY_AI_API_KEY, // Include API key
                },
            }
        );

        if (response.status !== 200) {
            throw new Error('Failed to initiate transcription');
        }

        console.log('Transcription initiated:', response.data);
        return response.data; // Return transcription result
    } catch (error) {
        console.error('Error during transcription request:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error to handle in the main function
    }
}

// Function to check the transcription status
async function checkTranscriptionStatus(transcriptionId) {
    try {
        console.log('Checking transcription status...');
        
        // Use template literals for the URL
        const response = await axios.get(
            `https://api.assemblyai.com/v2/transcript/${transcriptionId}`,
            {
                headers: {
                    authorization: process.env.ASSEMBLY_AI_API_KEY, // Include API key
                },
            }
        );

        return response.data; // Return transcription status
    } catch (error) {
        console.error('Error during status check:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error to handle in the main function
    }
}

// Main function to handle transcription with Google Drive link
export async function POST(req) {
    try {
        const { googleDriveLink } = await req.json();
        if (!googleDriveLink) {
            return NextResponse.json({ error: 'Google Drive link is missing in the request.' }, { status: 400 });
        }

        console.log('Received Google Drive link:', googleDriveLink);

        // Transcribe the audio using AssemblyAI
        const transcription = await transcribeFromGoogleDriveLink(googleDriveLink);

        // Check the status of transcription
        let transcriptionStatus = await checkTranscriptionStatus(transcription.id);

        // Wait for transcription to complete if it’s still in progress
        while (transcriptionStatus.status !== 'completed') {
            console.log('Transcription is still in progress...');
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
            transcriptionStatus = await checkTranscriptionStatus(transcription.id); // Check status again
        }

        return NextResponse.json({ transcription: transcriptionStatus.words }); // Return the transcribed text
    } catch (error) {
        console.error('Error in transcription process:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Failed to process transcription.' }, { status: 500 });
    }
}
