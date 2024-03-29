import React from "react";
import { makeStyles } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { UserInterfaceAndUserFollowInterface } from "types/User";
import { getUserInfo } from "api/api";
import { UserContext } from "contexts/UserContext";
import { baseStyle, borderRadius } from "theme";
import userIconImageDefault from "userIconImageDefault.webp";
import { FileArea } from "pages/FileArea";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import PersonIcon from "@material-ui/icons/Person";
import { fontSize } from "theme";
import { FollowButton } from "components/FollowButton";
import { useWSFollowInfo } from "dataService/userData";
import { VideoCallOpenModalButton } from "components/VideoCall/VideoCallOpenModalButton";
import { ChatButton } from "components/Chat/ChatButton";
import { Layout } from "components/Layout";
import { createChatRoom } from "api/apiChat";

export const ProfilePage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(UserContext);
  const [userInfo, setUserInfo] = React.useState<UserInterfaceAndUserFollowInterface>();
  const [isOwnUserId, setIsOwnUserId] = React.useState<boolean>(false);
  const [profilePageUserId, setProfilePageUserId] = React.useState("");
  const { followingList, followerList } = useWSFollowInfo(profilePageUserId);

  React.useEffect(() => {
    setIsOwnUserId(profilePageUserId === user.id);
  }, [profilePageUserId, user]);

  React.useEffect(() => {
    const f = async () => {
      if (user.token && profilePageUserId) {
        let userId = profilePageUserId ?? user.id;
        const newUserInfo = await getUserInfo(user.token, userId);
        setUserInfo((prev) => ({ ...prev, ...newUserInfo }));
      }
    };
    f();
  }, [profilePageUserId, user]);

  React.useEffect(() => {
    if (id) {
      setProfilePageUserId(id);
    }
  }, [id]);

  const handleClickChatButton = async () => {
    if (!isOwnUserId) {
      const chatRoom = await createChatRoom(user.token, [user.id, profilePageUserId]);
      navigate(`/chat/${chatRoom.id}`);
    }
  };

  const handleClickEditButton = () => {
    navigate("/edituser");
  };

  return (
    <Layout>
      <div className={classes.profilePage}>
        <div className={classes.profileArea}>
          <div className={classes.backgroundImageWrap}>
            <img className={classes.backgroundImage} src={userInfo?.background_image} alt="" />
          </div>
          <div className={classes.userInfoArea}>
            <div className={classes.userInfoLeftArea}>
              <div className={classes.iconImageWrap}>
                <img
                  className={classes.iconImage}
                  src={userInfo?.icon_image ?? userIconImageDefault}
                  alt=""
                />
              </div>
              <h3>{userInfo?.name}</h3>
            </div>
            <div className={classes.userInfoRightArea}>
              <div className={classes.friendshipArea}>
                <div className={classes.friendshipContent}>
                  <h5>フォロー</h5>
                  <p>{followingList?.length ?? "0"}</p>
                </div>
                <div className={classes.friendshipContent}>
                  <h5>フォロワー</h5>
                  <p>{followerList?.length ?? "0"}</p>
                </div>
              </div>
              {isOwnUserId ? (
                <></>
              ) : (
                <div className={classes.communicationArea}>
                  <ChatButton onClick={async () => await handleClickChatButton()} />
                  <VideoCallOpenModalButton userIdsByVideoCall={[user.id, profilePageUserId]} />
                </div>
              )}
              {isOwnUserId ? (
                <ButtonWithIcon
                  className={classes.editButton}
                  onClick={handleClickEditButton}
                  description="編集する"
                  icon={<PersonIcon style={{ fontSize: fontSize.medium.medium }} />}
                  variant="outlined"
                />
              ) : (
                <FollowButton userId={profilePageUserId} />
              )}
            </div>
          </div>
        </div>
        <FileArea className={classes.fileArea} userId={id} />
      </div>
    </Layout>
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
    justifyContent: "space-between",
  },
  userInfoLeftArea: {
    display: "flex",
    flexDirection: "column",
    gap: baseStyle.gap.small,
  },
  userInfoRightArea: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  communicationArea: {
    display: "flex",
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
