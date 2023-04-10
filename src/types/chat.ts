import { UserInterface } from "types/User";

export type Chat = {
  id: string;
  chat_room: ChatRoom;
  message: string;
  created_user: UserInterface;
  created_at: string;
};

export type ChatRoom = {
  id: string;
  latestChat: Chat; // Chatに置き換える
  users: UserInterface[];
  created_at: string;
};
