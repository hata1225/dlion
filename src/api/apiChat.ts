import { postAxios, getAxios } from "api/api";

/**
 * 現在のuserが含まれるChatRoomと、それに紐づく最新のChat1件を取得
 * @param token
 */
export const getChatRoomsByCurrentUser = async (token: string) => {
  const path = `/api/chat/chat_rooms/`;
  try {
    const result = await getAxios(path, token);
    return result.data;
  } catch (error) {
    console.log("@getChatRoomsByCurrentUser: ", error);
    throw error;
  }
};

export const getChatRoom = async (token: string, chatRoomId: string) => {
  const path = `/api/chat/chat_room/?chat_room_id=${chatRoomId}`;
  try {
    const result = await getAxios(path, token);
    return result.data;
  } catch (error) {
    console.log("@getChatRoom: ", error);
    throw error;
  }
};

export const createChatRoom = async (token: string, userIds: string[]) => {
  const path = `/api/chat/create_chat_room/`;
  const data = {
    user_ids: userIds,
  };
  try {
    await postAxios(path, data, token);
  } catch (error) {
    console.log("@createChatRoom: ", error);
    throw error;
  }
};

export const createChat = async (
  token: string,
  chatRoomId: string,
  message: string
) => {
  const path = `/api/chat/create_chat`;
  const data = {
    chat_room_id: chatRoomId,
    message: message,
  };
  try {
    await postAxios(path, data, token);
  } catch (error) {
    console.log("@createChat: ", error);
    throw error;
  }
};
