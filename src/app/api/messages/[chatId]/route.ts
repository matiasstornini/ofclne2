import { NextResponse } from "next/server";
import prisma from "@/db/prisma"; // Ajusta la importación según tu configuración

export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params;

    // Verificar que se pasó un chatId
    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    // Obtener los mensajes del chat de la base de datos
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: chatId },
          { receiverId: chatId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
