import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { UserInterface } from "types/User";
import { getUserInfo } from "api/api";
import { UserContext } from "contexts/UserContext";
import { baseStyle, borderRadius } from "theme";
import userIconImageDefault from "userIconImageDefault.webp";
import { FileArea } from "pages/FileArea";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import PersonIcon from "@material-ui/icons/Person";
import { fontSize } from "theme";

export const ProfilePage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { user } = React.useContext(UserContext);
  const [userInfo, setUserInfo] = React.useState<UserInterface>();

  React.useEffect(() => {
    console.log("id: ", id);
  }, [id]);

  React.useEffect(() => {
    const f = async () => {
      let userId = id ?? user?.id;
      if (userId && user?.token) {
        const newUserInfo = await getUserInfo(user.token, userId);
        setUserInfo(newUserInfo);
      }
    };
    f();
  }, [id, user]);

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
          <div className={classes.userInfoAreaLeft}>
            <div className={classes.iconImageWrap}>
              <img
                className={classes.iconImage}
                src={userInfo?.icon_image ?? userIconImageDefault}
                alt=""
              />
            </div>
            <div className={classes.followInfoArea}>
              <div>
                <p>フォロー</p>
                <p>2134</p>
              </div>
              <div>
                <p>フォロワー</p>
                <p>3581</p>
              </div>
            </div>
          </div>
          <div className={classes.userInfoTextArea}>
            <div className={classes.UserInfoTextAreaTop}>
              <h3>{userInfo?.name}</h3>
              {id === user?.id && (
                <ButtonWithIcon
                  className={classes.editButton}
                  onClick={handleClickEditButton}
                  description="編集する"
                  icon={
                    <PersonIcon style={{ fontSize: fontSize.medium.medium }} />
                  }
                  variant="outlined"
                />
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
  followInfoArea: {
    display: "flex",
  },
  userInfoArea: {
    width: "100%",
    marginTop: "20px",
    padding: "0 5px",
    display: "flex",
    gap: "10px",
    alignItems: "start",
  },
  userInfoAreaLeft: {},
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
    width: "120px",
  },
  fileArea: {
    padding: 0,
    margin: "50px 0 20px 0",
  },
});
