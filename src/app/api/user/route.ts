import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  try {
    // ✅ Obtener la sesión del usuario autenticado
    const { getUser } = getKindeServerSession();
    const currentUser = await getUser();

    if (!currentUser) {
      return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    // ✅ Buscar al usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { id: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Retornar los datos del usuario
    return NextResponse.json({
      userId: user.id,
      name: user.name || "Anonymous",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
