import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/prisma';

// Manejar el método POST
export async function POST(req: NextRequest) {
  try {
    // Leer el cuerpo de la solicitud
    const { content, senderId, receiverId } = await req.json();

    // Crear un nuevo mensaje en la base de datos
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });

    // Devolver una respuesta exitosa
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    // Manejar errores
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
