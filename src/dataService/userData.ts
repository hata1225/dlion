import React from "react";
import { UserInterface } from "types/User";

export const useWSFollowInfo = (userId: string) => {
  const [followingList, setFollowingList] = React.useState<UserInterface[]>();
  const [followerList, setFollowerList] = React.useState<UserInterface[]>();
  React.useEffect(() => {
    if (userId) {
      const ws = new WebSocket(`ws://localhost:8000/ws/follow/${userId}/`);

      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify({ action: "fetch_follow_info" }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data);

        if (data.type === "follow_info" || data.type === "follow_update") {
          const { following, follower } = data.data;
          setFollowingList(following);
          setFollowerList(follower);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

      return () => {
        ws.close();
      };
    }
  }, [userId]);
  return { followingList, followerList };
};
