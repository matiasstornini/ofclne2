'use client';

import { useEffect, useState, useCallback } from "react";
import { Search, Settings, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
}

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Cargar el ID del usuario una sola vez
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("Error fetching user data");
        const data = await response.json();
        if (data.userId) setCurrentUserId(data.userId);
        else console.error("No userId found in response");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserId();
  }, []);

  // ✅ Cargar los chats del usuario autenticado
  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUserId) return;
      try {
        const response = await fetch(`/api/chat?userId=${currentUserId}`);
        if (!response.ok) throw new Error("Error fetching chats");
        const data: Chat[] = await response.json();
        setChats(data); // Aquí no hacemos comparación innecesaria
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [currentUserId]); // Solo vuelve a cargar cuando `currentUserId` cambia

  // ✅ Manejo de selección de chat
  const handleSelectChat = useCallback((partnerId: string) => {
    router.push(`/messages/chat?userId=${currentUserId}&partnerId=${partnerId}`);
  }, [currentUserId, router]); // Evitar que se redefina la función en cada renderizado

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        {/* Encabezado */}
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="font-semibold">Messages</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages" className="pl-8" />
          </div>
        </div>

        {/* Lista de chats */}
        <ScrollArea className="flex-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-accent transition-colors`}
            >
              <Avatar>
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback>{chat.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{chat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(chat.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
