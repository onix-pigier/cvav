import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectDB();
    return NextResponse.json({ message: "MongoDB connecté", host: db.connection.host, db: db.connection.name });
  } catch (err : any) {
    return NextResponse.json({ error: err.message });
  }
}
