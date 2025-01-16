import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const chatId = Array.isArray(req.query.chatId) ? req.query.chatId[0] : req.query.chatId;

  if (req.method === "GET") {
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: chatId },
            { receiverId: chatId },
          ],
        },
        orderBy: { createdAt: "asc" },
      });

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
