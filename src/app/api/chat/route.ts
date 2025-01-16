import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing or invalid userId' }, { status: 400 });
    }

    // Obtener todos los mensajes donde el usuario sea remitente o receptor
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Obtener los chats únicos basados en los pares de usuarios
    const chatPairs = new Map<string, any>(); // Usaremos un Map para evitar duplicados

    // Procesar los mensajes y organizar los chats únicos
    messages.forEach((message) => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      if (!chatPairs.has(otherUserId)) {
        chatPairs.set(otherUserId, message);
      }
      // Para asegurarnos de que estamos tomando el último mensaje entre los usuarios, comparamos las fechas
      const existingMessage = chatPairs.get(otherUserId);
      if (new Date(message.createdAt) > new Date(existingMessage.createdAt)) {
        chatPairs.set(otherUserId, message);
      }
    });

    // Formatear los chats con los datos del otro usuario y el último mensaje
    const formattedChats = await Promise.all(
      Array.from(chatPairs.values()).map(async (message) => {
        const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;

        // Obtener los datos del otro usuario
        const user = await prisma.user.findUnique({
          where: { id: otherUserId },
        });

        return {
          id: user?.id,
          name: user?.name || 'Unknown',
          avatar: user?.image || '/default-avatar.png',
          lastMessage: message.content || '',
          timestamp: message.createdAt || '',
        };
      })
    );

    return NextResponse.json(formattedChats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}
