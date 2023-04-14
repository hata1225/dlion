import { makeStyles } from "@material-ui/core";
import { UserContext } from "contexts/UserContext";
import { changeCreatedAt } from "functions/changeDate";
import React from "react";
import { baseStyle, fontSize } from "theme";
import { Chat } from "types/chat";
import userIconImageDefault from "userIconImageDefault.webp";

interface Props {
  chat: Chat;
  isHiddenUserIcon: boolean; // アイコンを非表示にしたいときにtrue
  createdAtDate?: string;
}

export const ChatContent = ({
  chat,
  isHiddenUserIcon = false,
  createdAtDate,
}: Props) => {
  const classes = useStyles();
  const { created_user, message, created_at } = chat;
  const { user } = React.useContext(UserContext);

  const isCurrentUser = user.id === created_user.id;

  const { createdAtTime } = changeCreatedAt(created_at);

  if (isCurrentUser) {
    // チャット送信userが自分自身の場合は、右寄せ背景色付きになる
    return (
      <>
        <div className={classes.createdAtDateArea}>
          {createdAtDate ? (
            <p className={classes.createdAtDate}>{createdAtDate}</p>
          ) : (
            <></>
          )}
        </div>
        <div
          className={`${classes.chatContent} ${classes.chatContentCurrentUser}`}
        >
          <div className={classes.createdAtArea}>
            <p className={classes.createdAt}>{createdAtTime}</p>
          </div>
          <div
            className={`${classes.messageArea} ${classes.messageAreaCurrentUser}`}
          >
            <p className={`${classes.message} ${classes.messageCurrentUser}`}>
              {message}
            </p>
          </div>
        </div>
      </>
    );
  } else {
    // チャット送信userが自分自身以外
    return (
      <>
        <div className={classes.createdAtDateArea}>
          {createdAtDate ? (
            <p className={classes.createdAtDate}>{createdAtDate}</p>
          ) : (
            <></>
          )}
        </div>
        <div className={classes.chatContent}>
          <div className={classes.chatContentIconArea}>
            {isHiddenUserIcon ? (
              <></>
            ) : (
              <img
                className={`${classes.icon} ${classes.iconSmallSize}`}
                src={`${created_user?.icon_image ?? userIconImageDefault}`}
                alt={`${chat.created_user.name} icon`}
              />
            )}
          </div>
          <div className={classes.messageArea}>
            <p className={classes.message}>{message}</p>
          </div>
          <div className={classes.createdAtArea}>
            <p className={classes.createdAt}>{createdAtTime}</p>
          </div>
        </div>
      </>
    );
  }
};

const useStyles = makeStyles({
  createdAtDateArea: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  createdAtDate: {
    backgroundColor: baseStyle.color.gray.main,
    color: "white",
    padding: "2px 5px",
    margin: "5px 0",
    borderRadius: "5px",
  },
  chatContent: {
    width: "100%",
    display: "flex",
    paddingBottom: "3px",
    "&:last-child": {
      paddingBottom: "10px",
    },
  },
  chatContentCurrentUser: {
    justifyContent: "end",
  },
  chatContentIconArea: {
    marginRight: "10px",
    display: "flex",
    alignItems: "end",
    width: baseStyle.userIconSize.small,
  },
  messageArea: {
    maxWidth: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px",
    borderRadius: "5px 5px 5px 0",
    backgroundColor: baseStyle.color.white.main,
  },
  messageAreaCurrentUser: {
    backgroundColor: baseStyle.color.purple.main,
    borderRadius: "5px 5px 0 5px",
  },
  message: {
    fontSize: fontSize.medium.small,
  },
  messageCurrentUser: {
    color: baseStyle.color.white.light,
  },
  icon: {
    aspectRatio: "1 / 1",
    borderRadius: "50%",
    objectFit: "cover",
  },
  iconSmallSize: {
    height: baseStyle.userIconSize.small,
  },
  createdAtArea: {
    display: "flex",
    alignItems: "end",
    padding: "0 3px",
  },
  createdAt: {},
});
