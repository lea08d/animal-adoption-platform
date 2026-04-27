import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password, name, role } = await req.json();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
      name,
      role,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Registration failed", error: error.message },
      { status: 500 }
    );
  }
}