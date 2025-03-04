import { getBusiness } from "@/db/queries/business";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const name = (await params).name;
  try {
    const businessData = await getBusiness(name);
    return NextResponse.json({
      message: "Businesses fetched successfully",
      businessData,
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ message: error.message });
  }
}
