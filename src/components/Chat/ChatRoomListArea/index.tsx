import React from "react";
import { makeStyles } from "@material-ui/core";
import { useWSFollowInfo } from "dataService/userData";
import { UserContext } from "contexts/UserContext";
import { baseStyle } from "theme";
import userIconImageDefault from "userIconImageDefault.webp";
import { UserInterface } from "types/User";

export const ChatRoomListArea = () => {
  const classes = useStyles();
  const { user } = React.useContext(UserContext);
  const { followingList } = useWSFollowInfo(user.id);

  const handleClickFollowListContnet = async (followUser: UserInterface) => {};

  return (
    <div className={classes.chatRoomListArea}>
      <div className={classes.chatPageHeading}>
        <h2>チャット</h2>
      </div>
      {followingList.length ? (
        followingList?.map((followUser, i) => (
          <a
            key={i}
            className={classes.followListContent}
            color="primary"
            onClick={async () => await handleClickFollowListContnet(followUser)}
            href="/"
          >
            <img
              className={classes.iconImage}
              src={followUser?.icon_image ?? userIconImageDefault}
              alt=""
              loading="lazy"
            />
            <div className={classes.textArea}>
              <h3>{followUser.name}</h3>
              <p className={classes.message}>
                サンプルメッセージサンプルメッセージサンプルメッセージサンプルメッセージサンプルメッセージサンプルメッセージサンプルメッセージサンプルメッセージサンプルメッセージサンプルメッセージサンプルメッセージサンプルメッセージ
              </p>
            </div>
          </a>
        ))
      ) : (
        <p>フォローの数が0です。</p>
      )}
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
  chatPageHeading: {
    width: "100%",
  },
  followListContent: {
    height: "55px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "5px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
  },
  iconImage: {
    height: "100%",
    aspectRatio: "1",
    objectFit: "cover",
    borderRadius: "100%",
  },
  textArea: {
    height: "100%",
    padding: "1px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  message: {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
  },
});
