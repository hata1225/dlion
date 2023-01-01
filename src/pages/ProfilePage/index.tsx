import React from "react";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { UserInterface } from "types/User";
import { getUserInfo } from "api/api";
import { UserContext } from "contexts/UserContext";
import { baseStyle, borderRadius } from "theme";
import userIconImageDefault from "userIconImageDefault.webp";
import { FileArea } from "pages/FileArea";

export const ProfilePage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { user } = React.useContext(UserContext);
  const [userInfo, setUserInfo] = React.useState<UserInterface>();

  React.useEffect(() => {
    const f = async () => {
      if (id && user?.token) {
        const newUserInfo = await getUserInfo(user.token);
        setUserInfo(newUserInfo);
      }
    };
    f();
  }, [id, user]);

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
          <div className={classes.iconImageWrap}>
            <img
              className={classes.iconImage}
              src={userInfo?.icon_image ?? userIconImageDefault}
              alt=""
            />
          </div>
          <div className={classes.userInfoTextArea}>
            <h3>{userInfo?.name}</h3>
            <p>{userInfo?.description}</p>
          </div>
        </div>
      </div>
      <div>
        <FileArea className={classes.fileArea} isMine={true} />
      </div>
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
  userInfoArea: {
    width: "100%",
    marginTop: "20px",
    padding: "0 5px",
    display: "flex",
    gap: "10px",
    alignItems: "end",
  },
  userInfoTextArea: {
    display: "flex",
    gap: "5px",
    flexDirection: "column",
    justifyContent: "end",
  },
  fileArea: {
    padding: 0,
    margin: "50px 0 20px 0",
  },
});
