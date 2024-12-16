import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { VideoData } from '@/config/schema';

export async function GET(req, { params }) {
  console.log("Fetching video data for ID:", params.id);  // Check if the parameter is correct
  
  const { id } = params; // Extract the dynamic ID from the URL

  if (!id) {
    return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
  }

  try {
    const videoData = await db.select().from(VideoData).where(VideoData.id.eq(id)).first();

    if (!videoData) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(videoData);
  } catch (error) {
    console.error("Error fetching video data:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
