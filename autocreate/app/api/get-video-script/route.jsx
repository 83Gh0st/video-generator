import { chatSession } from "@/config/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the request payload
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required." },
                { status: 400 }
            );
        }

        console.log("Prompt received:", prompt);

        // Send the prompt to the chat session
        const result = await chatSession.sendMessage(prompt);

        // Await and parse the response text
        const responseText = await result.response.text();
        console.log("AI Response:", responseText);

        // Ensure the response is valid JSON before returning
        const parsedResponse = JSON.parse(responseText);

        return NextResponse.json({ result: parsedResponse });
    } catch (error) {
        console.error("Error processing request:", error);

        return NextResponse.json(
            { error: error.message || "An unknown error occurred." },
            { status: 500 }
        );
    }
}
