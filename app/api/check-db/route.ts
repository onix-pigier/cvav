import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Lister les collections existantes dans la base
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }
    const collections = await db.listCollections().toArray();
    const nomsCollections = collections.map((c) => c.name);

    return NextResponse.json({
      message: "Collections existantes dans la DB",
      collections: nomsCollections,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
