import { NextRequest, NextResponse } from "next/server";
import { createBusiness, getAllBusiness } from "@/db/queries/business";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const businessData = await createBusiness(data);

    return NextResponse.json({
      message: "Business created successfully",
      businessData,
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message });
  }
}

export async function GET() {
  try {
    const businessData = await getAllBusiness();
    return NextResponse.json({
      message: "Businesses fetched successfully",
      businessData,
    });8
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message });
  }
}
