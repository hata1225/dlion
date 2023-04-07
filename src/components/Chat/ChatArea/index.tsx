import React from "react";
import { makeStyles } from "@material-ui/core";
import { useWSFollowInfo } from "dataService/userData";
import { UserContext } from "contexts/UserContext";
import { baseStyle } from "theme";
import userIconImageDefault from "userIconImageDefault.webp";
import { UserInterface } from "types/User";

interface Props {
  chatRoomId: string;
}

export const ChatArea = ({}: Props) => {
  const classes = useStyles();
  const { user } = React.useContext(UserContext);
  const { followingList } = useWSFollowInfo(user.id);
  const [talkToUser, setTalkToUser] = React.useState<UserInterface>();

  return (
    <div className={classes.ChatArea}>
      <div className={classes.chatPageHeading}>
        <h2>{talkToUser?.name}</h2>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  ChatArea: {
    width: "100%",
    minWidth: baseStyle.card.minWidth,
    maxWidth: baseStyle.card.maxWidth,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  chatPageHeading: {
    width: "100%",
  },
});
