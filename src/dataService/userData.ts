import React from "react";
import { UserInterface } from "types/User";
import { w3cwebsocket } from "websocket";

export const useWSFollowInfo = (userId: string) => {
  const [followingList, setFollowingList] = React.useState<UserInterface[]>();
  const [followerList, setFollowerList] = React.useState<UserInterface[]>();
  React.useEffect(() => {
    if (userId) {
      const socket = new w3cwebsocket(
        `ws://localhost:8000/ws/follow/${userId}/`
      );
      socket.onmessage = (event) => {
        const data = JSON.parse(String(event.data));
        if (data.type === "following_list") {
          setFollowingList(data.data);
        } else if (data.type === "follower_list") {
          setFollowerList(data.data);
        }
      };
      return () => {
        socket.close();
      };
    }
  }, [userId]);
  return { followingList, followerList };
};
