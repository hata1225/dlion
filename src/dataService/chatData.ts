import { ENV } from "api/api";
import { UserContext } from "contexts/UserContext";
import React from "react";
import { Chat, ChatRoom } from "types/chat";

export const useWSChatRoomData = (chatRoomId: string) => {
  const [chatRoom, setChatRoom] = React.useState<ChatRoom>();
  const [chats, setChats] = React.useState<Chat[]>([]);
  React.useEffect(() => {
    const ws = new WebSocket(`ws://${ENV}:8000/ws/chat_room/${chatRoomId}/`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({ action: "fetch_chat_room" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message from server:", data);

      if (data.type === "chat_room" || data.type === "chat_room_update") {
        setChatRoom(data.data.chat_room);
        setChats(data.data.chats);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [chatRoomId]);
  return { chatRoom, chats };
};

export const useWSChatRoomsData = () => {
  const [chatRooms, setChatRooms] = React.useState<ChatRoom[]>([]);
  const { user } = React.useContext(UserContext);
  React.useEffect(() => {
    if (user.id) {
      const ws = new WebSocket(`ws://${ENV}:8000/ws/chat_rooms/${user.id}/`);

      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify({ action: "fetch_chat_rooms" }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data);

        if (data.type === "chat_rooms" || data.type === "chat_rooms_update") {
          setChatRooms(data.data);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

      return () => {
        ws.close();
      };
    }
  }, [user]);
  return { chatRooms };
};
