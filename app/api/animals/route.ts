import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Animal from "@/models/Animal";
import { verifyToken, requireRole } from "@/middleware/auth";

export async function GET(req: Request) {
  try {
    verifyToken(req);

    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const species = searchParams.get("species");
    const breed = searchParams.get("breed");
    const verificationStatus = searchParams.get("verificationStatus");

    const query: any = {};

    if (species) query.species = species;
    if (breed) query.breed = breed;
    if (verificationStatus) query.verificationStatus = verificationStatus;

    const animals = await Animal.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Animal.countDocuments(query);

    return NextResponse.json(
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        animals,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const status =
      error.message === "Missing or invalid authorization header" ||
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
        ? 401
        : 500;

    return NextResponse.json(
      { message: "Failed to fetch animals", error: error.message },
      { status }
    );
  }
}

export async function POST(req: Request) {
  try {
    requireRole(req, ["ADMIN", "STAFF"]);

    await connectToDatabase();

    const body = await req.json();

    const animal = await Animal.create(body);

    return NextResponse.json(animal, { status: 201 });
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
      { message: "Failed to create animal", error: error.message },
      { status }
    );
  }
}