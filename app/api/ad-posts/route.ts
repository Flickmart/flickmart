// Server

import { createAdPost } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    //Parse data form request Object
    const data = await req.json();
    // Get data after insertion in database
    const adData = await createAdPost(data);

    return NextResponse.json({
      message: "ad post created successfully",
      adData,
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message });
  }
}
