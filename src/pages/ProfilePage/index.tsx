import React from "react";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { UserInterface } from "types/User";
import { getUserInfo } from "api/api";
import { UserContext } from "contexts/UserContext";
import { baseStyle } from "theme";

export const ProfilePage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { user } = React.useContext(UserContext);
  const [userInfo, setUserInfo] = React.useState<UserInterface>();

  React.useEffect(() => {
    const f = async () => {
      if (id && user?.token) {
        const newUserInfo = await getUserInfo(user.token, id);
        setUserInfo(newUserInfo);
      }
    };
    f();
  }, [id, user]);

  return (
    <div className={classes.profilePage}>
      <div className={classes.profilePageInner}>
        <div className={classes.profileImageArea}>
          <div className={classes.backgroundImageWrap}>
            <img
              className={classes.backgroundImage}
              src={userInfo?.background_image}
              alt=""
            />
          </div>
          <div className={classes.iconImageWrap}>
            <img
              className={classes.iconImage}
              src={userInfo?.icon_image}
              alt=""
            />
          </div>
        </div>
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
  profilePageInner: {
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
  },
  iconImageWrap: {
    width: "25%",
    position: "absolute",
    top: "75%",
  },
  iconImage: {
    width: "100%",
    aspectRatio: "1",
    objectFit: "cover",
    borderRadius: "100%",
    padding: "3px",
    backgroundColor: baseStyle.color.white.light,
  },
});
