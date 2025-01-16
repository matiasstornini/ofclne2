'use client';

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { io } from "socket.io-client";
import { Send, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CldUploadWidget } from "next-cloudinary";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  isOutbound?: boolean;
  imageUrl?: string | null;
}

const socket = io();

export default function MessagesInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState<string>("");
  const [partnerName, setPartnerName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const currentUserId = searchParams.get("userId") as string;
  const chatPartnerId = searchParams.get("partnerId") as string;

  // Función para obtener los datos del chat
  const fetchData = useCallback(async () => {
    if (!chatPartnerId || !currentUserId) return;

    try {
      const userResponse = await fetch(`/api/userId?userId=${chatPartnerId}`);
      if (!userResponse.ok) throw new Error("Error fetching user data");
      const userData = await userResponse.json();
      setPartnerName(userData.name);

      const messagesResponse = await fetch(`/api/messages/${chatPartnerId}`);
      if (!messagesResponse.ok) throw new Error("Error fetching messages");
      const messagesData: Message[] = await messagesResponse.json();
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [chatPartnerId, currentUserId]);

  useEffect(() => {
    fetchData();

    // Escuchar mensajes entrantes a través del socket
    socket.on("receiveMessage", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [fetchData]);

  // Manejar el envío de mensajes
  const handleSendMessage = async () => {
    if (!messageContent.trim() && !imageUrl) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      senderId: currentUserId!,
      receiverId: chatPartnerId,
      createdAt: new Date().toISOString(),
      isOutbound: true,
      imageUrl: imageUrl || null,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageContent("");
    setImageUrl(null);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      // Emitir el mensaje a través del socket
      socket.emit("sendMessage", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Manejar la carga de imágenes
  const handleImageUpload = (result: any) => {
    const uploadedImageUrl = result?.info?.secure_url;
    if (uploadedImageUrl) {
      setImageUrl(uploadedImageUrl);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header del chat */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{partnerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{partnerName}</h2>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.senderId === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {message.content && <p className="text-sm">{message.content}</p>}
                {message.imageUrl && (
                  <img src={message.imageUrl} alt="Uploaded" className="mt-2 max-w-[200px] rounded-md" />
                )}
                <span className="text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input de mensaje */}
      <div className="p-4 border-t flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          className="flex-1"
        />

        <CldUploadWidget
          signatureEndpoint={"/api/sign-image"}
          onSuccess={handleImageUpload}
          options={{
            multiple: false,
            resourceType: "image",
          }}
        >
          {({ open }) => (
            <Button onClick={() => open()} variant="ghost" size="icon" className="w-10 h-10">
              <ImageIcon className="h-5 w-5" />
            </Button>
          )}
        </CldUploadWidget>

        <Button onClick={handleSendMessage}>
          <Send />
        </Button>
      </div>
    </div>
  );
}
