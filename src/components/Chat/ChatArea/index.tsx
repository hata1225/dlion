import React from "react";
import { IconButton, makeStyles, Paper, InputBase } from "@material-ui/core";
import { UserContext } from "contexts/UserContext";
import { baseStyle, fontSize, shadow } from "theme";
import { UserInterface } from "types/User";
import { useWSChatRoomData } from "dataService/chatData";
import { useExceptUsersByCurrentUser } from "functions/exceptUsers";
import { Chat, ChatRoom } from "types/chat";
import SendIcon from "@material-ui/icons/Send";
import { createChat } from "api/apiChat";
import { createNotification } from "functions/notification";
import { ChatContent } from "components/Chat/ChatContent";
import userIconImageDefault from "userIconImageDefault.webp";
import { changeCreatedAt } from "functions/changeDate";
import { useNavigate } from "react-router-dom";

interface Props {
  chatRoomId: string;
  chatRoomProp?: ChatRoom;
}

/**
 * DM(グループチャット以外)で使う
 */
export const ChatArea = ({ chatRoomId, chatRoomProp }: Props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [message, setMessage] = React.useState("");
  const [chatsState, setChatsState] = React.useState<Chat[]>([]);
  const [userByChatPartner, setUserByChatPartner] = React.useState<UserInterface>();
  const { user } = React.useContext(UserContext);
  const { chatRoom, chats } = useWSChatRoomData(chatRoomId);
  const users = useExceptUsersByCurrentUser(chatRoom?.users ?? []);

  React.useEffect(() => {
    if (users.length) {
      setUserByChatPartner(users[0]);
    }
  }, [users]);

  React.useEffect(() => {
    setChatsState(chats);
  }, [chats]);

  React.useEffect(() => {
    const container = document.getElementById("chatContainer");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatsState]);

  const handleClickSendButton = async () => {
    try {
      if (chatRoom && message) {
        const currentDate = new Date()
          .toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(/\//g, "-")
          .replace(/ /g, "T");
        setChatsState((prev) => [
          ...prev,
          {
            id: "",
            chat_room: chatRoom,
            message,
            created_user: user,
            created_at: `${currentDate}`,
          },
        ]);
      }
      setMessage("");
      await createChat(user.token, chatRoomId, message);
    } catch (error: any) {
      createNotification("danger", error?.message, "投稿に失敗しました");
    }
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleClickIcon = () => {
    navigate(`/profile/${userByChatPartner?.id}`);
  };

  return (
    <div className={classes.chatAreaWrap}>
      <div className={classes.chatArea}>
        <Paper className={classes.headingArea}>
          <img
            className={`${classes.icon} ${classes.iconMainSize}`}
            src={userByChatPartner?.icon_image ?? userIconImageDefault}
            alt={`${userByChatPartner?.name} icon`}
            onClick={handleClickIcon}
          />
          <h2>{userByChatPartner?.name}</h2>
        </Paper>
        <div id="chatContainer" className={classes.chatContainer}>
          <div>
            {chatsState?.map((chat, key) => {
              const isLastChat = chatsState.length - 1 > key;
              const isLatestChat = key === 0;
              const nextChat = isLastChat ? chatsState[key + 1] : null;
              const prevChat = isLatestChat ? null : chatsState[key - 1];
              const currentDate = changeCreatedAt(chat.created_at).createdAtDate;
              const prevDate = prevChat ? changeCreatedAt(prevChat.created_at).createdAtDate : null;

              const isHiddenUserIcon = Boolean(
                nextChat && nextChat.created_user.id === chat.created_user.id
              );
              const isVisibleCreatedAtDate = isLatestChat || currentDate !== prevDate;

              const createdAtDate = isVisibleCreatedAtDate ? currentDate : "";

              return (
                <ChatContent
                  key={key}
                  chat={chat}
                  isHiddenUserIcon={isHiddenUserIcon}
                  createdAtDate={createdAtDate}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className={classes.inputArea}>
        <Paper className={classes.inputContainer}>
          <InputBase
            className={classes.inputBase}
            value={message}
            onChange={handleChangeMessage}
            multiline
            maxRows={5}
            placeholder="Type your message..."
          />
          <div className={classes.sendButtonArea}>
            <IconButton
              className={classes.sendIconButton}
              onClick={handleClickSendButton}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleClickSendButton();
                }
              }}
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
  chatAreaWrap: {
    height: "100%",
    width: "100%",
    minWidth: baseStyle.card.minWidth,
    maxWidth: baseStyle.card.maxWidth,
  },
  chatArea: {
    height: "calc(100% - 75px)",
    paddingTop: "30px",
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: baseStyle.gap.small,
  },
  headingArea: {
    display: "flex",
    gap: baseStyle.gap.main,
    width: "100%",
    alignItems: "center",
    padding: "10px",
  },
  icon: {
    aspectRatio: "1 / 1",
    borderRadius: "50%",
    objectFit: "cover",
  },
  iconMainSize: {
    height: baseStyle.userIconSize.main,
    cursor: "pointer",
  },
  chatContainer: {
    overflow: "scroll",
  },
  inputArea: {
    width: "100%",
    paddingBottom: "30px",
  },
  inputContainer: {
    height: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    padding: "5px",
    gap: baseStyle.gap.small,
    backgroundColor: baseStyle.color.white.main,
    borderRadius: "25px",
  },
  inputBase: {
    width: "100%",
    paddingLeft: "10px",
    fontSize: fontSize.medium.medium,
  },
  sendButtonArea: {
    display: "flex",
    alignItems: "end",
  },
  sendIconButton: {
    height: baseStyle.iconButtonSize.main,
    width: baseStyle.iconButtonSize.main,
    boxShadow: shadow.main,
    backgroundColor: baseStyle.color.purple.main,
    "&:hover": {
      backgroundColor: baseStyle.color.purple.mainButtonHover,
    },
  },
  sendIcon: {
    color: baseStyle.color.white.light,
  },
});
