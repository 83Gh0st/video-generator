import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { VideoData } from '@/config/schema'; // Import the schema for the videoData table

export async function POST(req) {
    try {
        const { script, audioFileUrl, captions, imageList, createdBy } = await req.json();

        // Use Drizzle ORM to insert data into the database
        const result = await db.insert(VideoData).values({
            script,          // Expecting JSON array
            audioFileUrl,    // String
            captions,        // JSON object
            imageList,       // Array of strings
            createdBy        // String
        }).returning(); // Returning the inserted record

        return NextResponse.json({ id: result[0].id }); // Return the ID of the inserted record
    } catch (error) {
        console.error("Error saving data:", error.message);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

