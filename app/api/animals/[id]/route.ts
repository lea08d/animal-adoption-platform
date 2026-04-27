import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Animal from "@/models/Animal";
import { verifyToken, requireRole } from "@/middleware/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    verifyToken(req);

    await connectToDatabase();
    const { id } = await context.params;

    const animal = await Animal.findById(id);

    if (!animal) {
      return NextResponse.json(
        { message: "Animal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(animal);
  } catch (error: any) {
    const status =
      error.message === "Missing or invalid authorization header" ||
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
        ? 401
        : 500;

    return NextResponse.json(
      { message: "Failed to fetch animal", error: error.message },
      { status }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(req, ["ADMIN", "STAFF"]);

    await connectToDatabase();
    const { id } = await context.params;
    const body = await req.json();

    const updatedAnimal = await Animal.findByIdAndUpdate(id, body, {
  new: true,
  runValidators: true,
});

    if (!updatedAnimal) {
      return NextResponse.json(
        { message: "Animal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAnimal);
  } catch (error: any) {
    const status =
      error.message === "Missing or invalid authorization header" ||
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
        ? 401
        : error.message === "Forbidden"
        ? 403
        : 500;

    return NextResponse.json(
      { message: "Failed to update animal", error: error.message },
      { status }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(req, ["ADMIN"]);

    await connectToDatabase();
    const { id } = await context.params;

    const deletedAnimal = await Animal.findByIdAndDelete(id);

    if (!deletedAnimal) {
      return NextResponse.json(
        { message: "Animal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Animal deleted successfully" });
  } catch (error: any) {
    const status =
      error.message === "Missing or invalid authorization header" ||
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
        ? 401
        : error.message === "Forbidden"
        ? 403
        : 500;

    return NextResponse.json(
      { message: "Failed to delete animal", error: error.message },
      { status }
    );
  }
}