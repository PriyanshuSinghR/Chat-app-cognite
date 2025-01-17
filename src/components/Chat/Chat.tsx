"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Message } from "@/types/chat";
import { UserList } from "@/components/Sidebar/UserList";
import { ChatWindow } from "@/components/Chat/ChatWindow";

const socket: Socket = io("http://localhost:3001");

export default function Chat() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");
  const selectedUserParam = searchParams.get("selectedUser");
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>(
    selectedUserParam || ""
  );
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (selectedUser) {
      router.push(`/chat?userId=${userId}&selectedUser=${selectedUser}`);
    }
  }, [selectedUser, userId, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data.filter((user: string) => user !== userId));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
        socket.emit("login", userId);
      });

      //   socket.on("receiveMessage", (newMessage: Message) => {
      //     setChatHistory((prev) => [...prev, newMessage]);
      //   });

      socket.on("receiveMessage", (newMessage: Message) => {
        const { sender, receiver } = newMessage;

        if (receiver === selectedUser || sender === selectedUser) {
          setChatHistory((prev) => [...prev, newMessage]);
        }
        console.log(
          { sender },
          { selectedUser },
          { receiver },
          { userId },
          { newMessage }
        );
        // if (receiver === userId && sender === selectedUser) {
        //   setChatHistory((prev) => [...prev, newMessage]);
        // }
      });

      socket.on("chatHistory", (messages: Message[]) => {
        setChatHistory(messages);
      });

      return () => {
        socket.off("receiveMessage");
        socket.off("chatHistory");
        socket.disconnect();
      };
    }
  }, [userId, selectedUser]);

  useEffect(() => {
    if (selectedUser && userId) {
      socket.emit("fetchChatHistory", {
        sender: userId,
        receiver: selectedUser,
      });
    }
  }, [selectedUser, userId]);

  const handleSendMessage = (message: string) => {
    if (message && selectedUser && userId) {
      const newMessage: Message = {
        sender: userId,
        receiver: selectedUser,
        message: message,
        timestamp: new Date(),
      };

      setChatHistory((prev) => [...prev, newMessage]);

      socket.emit("sendMessage", {
        sender: userId,
        receiver: selectedUser,
        message: message,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <UserList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        isLoading={isLoading}
      />
      <ChatWindow
        selectedUser={selectedUser}
        messages={chatHistory}
        currentUserId={userId || ""}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
