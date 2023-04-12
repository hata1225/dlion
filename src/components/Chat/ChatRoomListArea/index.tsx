import React from "react";
import { makeStyles } from "@material-ui/core";
import { baseStyle } from "theme";
import { useWSChatRoomsData } from "dataService/chatData";
import { ChatRoomContent } from "components/Chat/ChatRoomContent";

export const ChatRoomListArea = () => {
  const classes = useStyles();
  const { chatRooms } = useWSChatRoomsData();

  React.useEffect(() => {
    console.log("chatrooms: ", chatRooms);
  }, [chatRooms]);

  // チャットルーム作成の関数例
  // const handleClickFollowListContnet = async (followUser: UserInterface) => {
  //   await createChatRoom(user.token, [user.id, followUser.id]);
  // };

  return (
    <div className={classes.chatRoomListArea}>
      <div className={classes.chatPageHeadingArea}>
        <h2>チャット</h2>
      </div>
      <div className={classes.chatRoomsArea}>
        {chatRooms?.map((chatRoom, key) => {
          return <ChatRoomContent key={key} chatRoom={chatRoom} />;
        })}
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  chatRoomListArea: {
    width: "100%",
    minWidth: baseStyle.card.minWidth,
    maxWidth: baseStyle.card.maxWidth,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  chatPageHeadingArea: {
    width: "100%",
  },
  chatRoomsArea: {
    width: "100%",
  },
  chatRoomsAreaContent: {},
  textArea: {},
  chatRoomName: {},
  message: {},
});
