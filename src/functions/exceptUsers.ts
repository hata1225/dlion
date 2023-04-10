import { UserContext } from "contexts/UserContext";
import React from "react";
import { UserInterface } from "types/User";

export const useExceptUsersByCurrentUser = (chatRoomUsers: UserInterface[]) => {
  const { user } = React.useContext(UserContext);
  let newUsers: UserInterface[] = [];
  chatRoomUsers?.forEach((chatRoomUser) => {
    if (chatRoomUser.id !== user.id) {
      newUsers.push(chatRoomUser);
    }
  });
  return newUsers;
};
