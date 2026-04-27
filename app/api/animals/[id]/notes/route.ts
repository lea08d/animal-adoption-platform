import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AnimalNote from "@/models/AnimalNote";
import { verifyToken } from "@/middleware/auth";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyToken(req);

    await connectToDatabase();
    const { id: animalId } = await context.params;

    const body = await req.json();

    const note = await AnimalNote.create({
      animalId,
      authorId: user.id,
      type: body.type,
      text: body.text,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create note", error: error.message },
      { status: 500 }
    );
  }
}