import { makeStyles } from "@material-ui/core";
import { baseStyle } from "theme";
import { ChatRoom } from "types/chat";
import { useExceptUsersByCurrentUser } from "functions/exceptUsers";
import { UserInterface } from "types/User";
import userIconImageDefault from "userIconImageDefault.webp";
import { createChatRoom } from "api/apiChat";
import React from "react";
import { UserContext } from "contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface Props {
  chatRoom?: ChatRoom;
  followUser?: UserInterface;
}

export const ChatRoomContent = ({ chatRoom, followUser }: Props) => {
  const classes = useStyles();
  const users = useExceptUsersByCurrentUser(chatRoom?.users);
  const { user } = React.useContext(UserContext);
  const navigate = useNavigate();

  const handleClickFollowListContnet = async (followUser?: UserInterface) => {
    if (followUser) {
      const chatRoom = await createChatRoom(user.token, [
        user.id,
        followUser.id,
      ]);
      navigate(`/chat/${chatRoom.id}`);
    }
  };

  if (chatRoom) {
    return (
      <a className={classes.chatRoomContent} href={`/chat/${chatRoom.id}`}>
        <img
          className={classes.chatRoomIcon}
          src={users[0]?.icon_image ?? userIconImageDefault}
          alt={`${users[0]?.name} icon`}
        />
        <div className={classes.textArea}>
          <h3 className={classes.chatRoomName}>{users[0]?.name}</h3>
          <p className={classes.message}>
            {chatRoom?.latest_chat?.message ?? ""}
          </p>
        </div>
      </a>
    );
  } else {
    return (
      <div
        className={`${classes.chatRoomContent}`}
        onClick={async () => await handleClickFollowListContnet(followUser)}
      >
        <img
          className={classes.chatRoomIcon}
          src={followUser?.icon_image ?? userIconImageDefault}
          alt={`${followUser?.name} icon`}
        />
        <div className={classes.textArea}>
          <h3 className={classes.chatRoomName}>{followUser?.name}</h3>
        </div>
      </div>
    );
  }
};

const useStyles = makeStyles({
  chatRoomContent: {
    width: "100%",
    padding: "5px",
    display: "flex",
    gap: "5px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgb(0 0 0 / .05)",
    },
  },
  chatRoomIcon: {
    width: baseStyle.userIconSize.main,
    aspectRatio: "1 / 1",
    borderRadius: "50%",
    objectFit: "cover",
  },
  textArea: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "3px 0",
  },
  chatRoomName: {
    width: "100%",
  },
  message: {
    width: "100%",
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
  },
});
