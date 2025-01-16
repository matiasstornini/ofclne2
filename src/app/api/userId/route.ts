import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(request: Request) {
  // Obtener el `userId` desde la query string
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "No userId provided" }, { status: 400 });
  }

  // Buscar el usuario en la base de datos
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Retornar los datos del usuario
  return NextResponse.json({
    userId: user.id,
    name: user.name || "Anonymous",
  });
}
