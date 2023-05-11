import React from "react";
import { makeStyles } from "@material-ui/core";
import { baseStyle } from "theme";
import { useWSChatRoomsData } from "dataService/chatData";
import { ChatRoomContent } from "components/Chat/ChatRoomContent";
import { UserContext } from "contexts/UserContext";

export const ChatRoomListArea = () => {
  const classes = useStyles();
  const { chatRooms } = useWSChatRoomsData();
  const { user } = React.useContext(UserContext);

  return (
    <div className={classes.chatRoomListArea}>
      <div className={classes.chatPageHeadingArea}>
        <h2>チャット</h2>
      </div>
      <div className={classes.chatRoomsArea}>
        {chatRooms?.map((chatRoom, key) => {
          return <ChatRoomContent key={key} chatRoom={chatRoom} />;
        })}
        {chatRooms.length ? (
          <></>
        ) : (
          user.following?.map((followUser, key) => {
            return <ChatRoomContent key={key} followUser={followUser} />;
          })
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  chatRoomListArea: {
    paddingTop: baseStyle.pageLayoutInnerTop.main,
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
