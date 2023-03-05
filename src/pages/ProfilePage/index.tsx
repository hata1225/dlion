import React from "react";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { UserInterfaceAndUserFollowInterface } from "types/User";
import {
  getFollowerListByUserId,
  getFollowingListByUserId,
  getUserInfo,
} from "api/api";
import { UserContext } from "contexts/UserContext";
import { baseStyle, borderRadius } from "theme";
import userIconImageDefault from "userIconImageDefault.webp";
import { FileArea } from "pages/FileArea";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import PersonIcon from "@material-ui/icons/Person";
import { fontSize } from "theme";
import { FollowButton } from "components/FollowButton";

export const ProfilePage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { user } = React.useContext(UserContext);
  const [userInfo, setUserInfo] =
    React.useState<UserInterfaceAndUserFollowInterface>();
  const [isOwnUserId, setIsOwnUserId] = React.useState<boolean>(false);
  const [profilePageUserId, setProfilePageUserId] = React.useState("");

  React.useEffect(() => {
    setIsOwnUserId(profilePageUserId === user.id);
  }, [profilePageUserId, user]);

  React.useEffect(() => {
    const f = async () => {
      let userId = profilePageUserId ?? user.id;
      const newUserInfo = await getUserInfo(user.token, userId);
      const newFollowingList = await getFollowingListByUserId(
        user.token,
        userId
      );
      const newFollowerList = await getFollowerListByUserId(user.token, userId);
      setUserInfo({
        ...newUserInfo,
        following: newFollowingList,
        followers: newFollowerList,
      });
    };
    f();
  }, [profilePageUserId, user]);

  React.useEffect(() => {
    if (id) {
      setProfilePageUserId(id);
    }
  }, [id]);

  const handleClickEditButton = () => {
    window.location.href = "/edituser";
  };

  return (
    <div className={classes.profilePage}>
      <div className={classes.profileArea}>
        <div className={classes.backgroundImageWrap}>
          <img
            className={classes.backgroundImage}
            src={userInfo?.background_image}
            alt=""
          />
        </div>
        <div className={classes.userInfoArea}>
          <div className={classes.userInfoAreaTop}>
            <div className={classes.iconImageWrap}>
              <img
                className={classes.iconImage}
                src={userInfo?.icon_image ?? userIconImageDefault}
                alt=""
              />
            </div>
            <div className={classes.friendshipArea}>
              <div className={classes.friendshipContent}>
                <h5>フォロー</h5>
                <p>{userInfo?.following?.length ?? "0"}</p>
              </div>
              <div className={classes.friendshipContent}>
                <h5>フォロワー</h5>
                <p>{userInfo?.followers?.length ?? "0"}</p>
              </div>
            </div>
          </div>
          <div className={classes.userInfoTextArea}>
            <div className={classes.UserInfoTextAreaTop}>
              <h3>{userInfo?.name}</h3>
              {isOwnUserId ? (
                <ButtonWithIcon
                  className={classes.editButton}
                  onClick={handleClickEditButton}
                  description="編集する"
                  icon={
                    <PersonIcon style={{ fontSize: fontSize.medium.medium }} />
                  }
                  variant="outlined"
                />
              ) : (
                <FollowButton userId={profilePageUserId} />
              )}
            </div>
            <p>{userInfo?.description}</p>
          </div>
        </div>
      </div>
      <FileArea className={classes.fileArea} userId={id} />
    </div>
  );
};

const useStyles = makeStyles({
  profilePage: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  profileArea: {
    width: "100%",
    maxWidth: baseStyle.profilePageInnerWidth.main,
  },
  profileImageArea: {
    width: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  backgroundImageWrap: {
    width: "100%",
  },
  backgroundImage: {
    width: "100%",
    aspectRatio: "16 / 6",
    objectFit: "cover",
    verticalAlign: "top",
    backgroundColor: baseStyle.color.gray.main,
    borderRadius: borderRadius.main,
  },
  iconImageWrap: {
    minWidth: "85px",
    maxWidth: "85px",
    maxHeight: "85px",
  },
  iconImage: {
    width: "100%",
    aspectRatio: "1",
    objectFit: "cover",
    borderRadius: "100%",
    backgroundColor: baseStyle.color.white.light,
  },
  friendshipArea: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  friendshipContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
  },
  userInfoArea: {
    width: "100%",
    marginTop: "20px",
    padding: "0 5px",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  userInfoAreaTop: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  userInfoTextArea: {
    width: "100%",
    display: "flex",
    gap: "5px",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  UserInfoTextAreaTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editButton: {
    width: baseStyle.button.width.main,
  },
  fileArea: {
    padding: 0,
    margin: "50px 0 20px 0",
  },
});
