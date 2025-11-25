import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Role from "@/models/role";

export async function GET() {
  await connectDB();
  const roles = await Role.find();
  return NextResponse.json({ roles });
}

export async function POST(request: Request) {
  await connectDB();
  const { nom, permissions } = await request.json();

  if (!nom || !permissions) {
    return NextResponse.json({ message: "Nom et permissions requis." }, { status: 400 });
  }

  const existing = await Role.findOne({ nom });
  if (existing) {
    return NextResponse.json({ message: `Le rôle "${nom}" existe déjà.` }, { status: 400 });
  }

  const role = await Role.create({ nom, permissions });
  return NextResponse.json({ message: "Rôle créé.", role });
}

export async function DELETE(request: Request) {
  await connectDB();
  const { id } = await request.json();
  const role = await Role.findByIdAndDelete(id);
  return NextResponse.json({ message: "Rôle supprimé.", role });
}

export async function PUT(request: Request) {
  await connectDB();
  const { id, nom, permissions } = await request.json();
  const role = await Role.findByIdAndUpdate(id, { nom, permissions }, { new: true });
  return NextResponse.json({ message: "Rôle mis à jour.", role });
}

