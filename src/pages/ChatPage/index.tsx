import { makeStyles } from "@material-ui/core";
import { ChatRoomListArea } from "components/Chat/ChatRoomListArea";
import { ChatArea } from "components/Chat/ChatArea";
import { baseStyle } from "theme";
import { useParams } from "react-router-dom";
import React from "react";

export const ChatPage = () => {
  const { id } = useParams(); // ChatRoomのid
  const classes = useStyles();

  return (
    <div className={classes.chatPage}>
      {id ? <ChatArea chatRoomId={id} /> : <ChatRoomListArea />}
    </div>
  );
};

const useStyles = makeStyles({
  chatPage: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: baseStyle.pageLayoutInnerTop.main,
  },
});
