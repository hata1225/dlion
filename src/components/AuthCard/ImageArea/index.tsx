import { makeStyles } from "@material-ui/core";
import { UserContext } from "contexts/UserContext";
import React from "react";
import { baseStyle, borderRadius, fontSize } from "theme";
import userIconImageDefault from "../userIconImageDefault.webp";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

export const ImageArea = () => {
  const classes = useStyles();
  const [isHoverUserBackgroundImage, setIsHoverUserBackgroundImage] =
    React.useState(false);
  const [isHoverUserIconImage, setIsHoverUserIconImage] = React.useState(false);
  const { user } = React.useContext(UserContext);

  return (
    <>
      <div className={classes.imageArea}>
        <div
          className={classes.userBackgroundImageArea}
          onMouseEnter={() => setIsHoverUserBackgroundImage(true)}
          onMouseLeave={() => setIsHoverUserBackgroundImage(false)}
        >
          {user?.background_image && (
            <img
              className={classes.userBackgroundImage}
              src={user.background_image}
              alt=""
            />
          )}
          {isHoverUserBackgroundImage && (
            <div
              className={classes.changeView}
              style={{ borderRadius: borderRadius.main }}
            >
              <AddAPhotoIcon style={{ fontSize: fontSize.large.large }} />
            </div>
          )}
        </div>
        <div
          className={classes.userIconImageArea}
          onMouseEnter={() => setIsHoverUserIconImage(true)}
          onMouseLeave={() => setIsHoverUserIconImage(false)}
        >
          <img
            className={classes.userIconImage}
            src={user?.icon_image ?? userIconImageDefault}
            alt={user?.name}
          />
          {isHoverUserIconImage && (
            <div className={classes.changeView} style={{ borderRadius: "50%" }}>
              <AddAPhotoIcon style={{ fontSize: fontSize.large.large }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles({
  imageArea: {
    position: "relative",
    marginBottom: `calc(${baseStyle.editPageUserIconSize.main} / 3)`,
  },
  changeView: {
    height: "100%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: baseStyle.color.white.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userBackgroundImageArea: {
    width: "100%",
    aspectRatio: "16 / 6",
    backgroundColor: baseStyle.color.gray.light,
    borderRadius: borderRadius.main,
    cursor: "pointer",
  },
  userBackgroundImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  userIconImageArea: {
    width: baseStyle.editPageUserIconSize.main,
    height: baseStyle.editPageUserIconSize.main,
    borderRadius: "50%",
    backgroundColor: baseStyle.color.gray.main,
    bottom: `calc(-${baseStyle.editPageUserIconSize.main} / 3)`,
    position: "absolute",
    marginLeft: "10px",
    cursor: "pointer",
    zIndex: 10,
  },
  userIconImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  },
});
