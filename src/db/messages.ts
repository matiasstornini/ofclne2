import prisma from "@/db/prisma";

// 1. Función para enviar un mensaje
export async function sendMessage(senderId: string, receiverId: string, content: string) {
  return await prisma.message.create({
    data: {
      content,
      senderId,
      receiverId,
    },
  });
}

// 2. Función para obtener los mensajes entre dos usuarios
export async function getMessages(senderId: string, receiverId: string) {
  return await prisma.message.findMany({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
    orderBy: { createdAt: "asc" }, // Ordenar por fecha de creación
  });
}
