import React from "react";
import { IconButton, makeStyles, Paper, InputBase } from "@material-ui/core";
import { UserContext } from "contexts/UserContext";
import { baseStyle, fontSize } from "theme";
import { UserInterface } from "types/User";
import { useWSChatRoomData } from "dataService/chatData";
import { useExceptUsersByCurrentUser } from "functions/exceptUsers";
import { ChatRoom } from "types/chat";
import SendIcon from "@material-ui/icons/Send";
import { createChat } from "api/apiChat";
import { createNotification } from "functions/notification";

interface Props {
  chatRoomId: string;
  chatRoomProp?: ChatRoom;
}

/**
 * DM(グループチャット以外)で使う
 */
export const ChatArea = ({ chatRoomId, chatRoomProp }: Props) => {
  const classes = useStyles();
  const [message, setMessage] = React.useState("");
  const [userByChatPartner, setUserByChatPartner] =
    React.useState<UserInterface>();
  const { user } = React.useContext(UserContext);
  const { chatRoom, chats } = useWSChatRoomData(chatRoomId);
  const users = useExceptUsersByCurrentUser(chatRoom?.users ?? []);

  React.useEffect(() => {
    if (users.length) {
      setUserByChatPartner(users[0]);
    }
  }, [users]);

  const handleClickSendButton = async () => {
    try {
      await createChat(user.token, chatRoomId, message);
      setMessage("");
    } catch (error: any) {
      createNotification("danger", error?.message, "投稿に失敗しました");
    }
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className={classes.chatArea}>
      <div className={classes.headingArea}>
        <img
          className={`${classes.icon} ${classes.iconMainSize}`}
          src={userByChatPartner?.icon_image}
          alt={`${userByChatPartner?.name} icon`}
        />
        <h2>{userByChatPartner?.name}</h2>
      </div>
      <div className={classes.chatContainer}>
        {chats.map((chat, key) => {
          const { message, created_user } = chat;
          return (
            <div className={classes.chatContent} key={key}>
              <div className={classes.chatContentIconArea}>
                <img
                  className={`${classes.icon} ${classes.iconMainSize}`}
                  src={`${created_user.icon_image}`}
                  alt=""
                />
              </div>
              <div>
                <p>{message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className={classes.inputArea}>
        <Paper className={classes.inputContainer}>
          <InputBase
            className={classes.inputBase}
            value={message}
            onChange={handleChangeMessage}
            multiline
            maxRows={5}
          />
          <div className={classes.sendButtonArea}>
            <IconButton
              className={classes.sendIconButton}
              onClick={handleClickSendButton}
            >
              <SendIcon className={classes.sendIcon} />
            </IconButton>
          </div>
        </Paper>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  chatArea: {
    width: "100%",
    minWidth: baseStyle.card.minWidth,
    maxWidth: baseStyle.card.maxWidth,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  headingArea: {
    display: "flex",
    gap: "10px",
    width: "100%",
    alignItems: "center",
  },
  icon: {
    aspectRatio: "1 / 1",
    borderRadius: "50%",
    objectFit: "cover",
  },
  iconMainSize: {
    height: baseStyle.userIconSize.small,
  },
  chatContainer: {},
  chatContent: {
    display: "flex",
    gap: "10px",
  },
  chatContentIconArea: {},
  inputArea: {},
  inputContainer: {
    height: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    padding: "5px",
    gap: "5px",
  },
  inputBase: {
    width: "100%",
    fontSize: fontSize.medium.medium,
  },
  sendButtonArea: {
    display: "flex",
    alignItems: "end",
  },
  sendIconButton: {
    height: baseStyle.iconButtonSize.main,
    width: baseStyle.iconButtonSize.main,
    backgroundColor: baseStyle.color.purple.main,
    "&:hover": {
      backgroundColor: baseStyle.color.purple.mainButtonHover,
    },
  },
  sendIcon: {
    color: baseStyle.color.white.light,
  },
});
