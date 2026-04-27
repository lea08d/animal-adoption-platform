import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ message: "Database connected successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Database connection failed", error },
      { status: 500 }
    );
  }
}