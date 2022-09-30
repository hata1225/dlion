import { makeStyles } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PersonIcon from "@material-ui/icons/Person";
import HomeIcon from "@material-ui/icons/Home";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { fontSize, baseStyle, shadow } from "theme";
import React from "react";
import { PostModalContext } from "contexts/PostModalContext";
import { UserContext } from "contexts/UserContext";

type SubAreaContents = {
  func: any;
  description: string;
  icon: React.ReactNode;
}[];

export const SubArea = () => {
  const classes = useStyles();
  const { handleOpenPostModal } = React.useContext(PostModalContext);
  const { signout } = React.useContext(UserContext);

  const handleClickHomeIcon = () => {
    window.location.href = "/";
  };

  const handleClickSignout = () => {
    signout();
  };

  const handleClickUserEditButton = () => {
    window.location.href = "/edituser";
  };

  const subAreaContents: SubAreaContents = [
    {
      func: handleClickHomeIcon,
      description: "ホーム",
      icon: <HomeIcon style={{ fontSize: fontSize.medium.medium }} />,
    },
    {
      func: handleClickSignout,
      description: "ログアウト",
      icon: <ExitToAppIcon style={{ fontSize: fontSize.medium.medium }} />,
    },
    {
      func: handleOpenPostModal,
      description: "データ投稿",
      icon: <CloudUploadIcon style={{ fontSize: fontSize.medium.medium }} />,
    },
    {
      func: handleClickUserEditButton,
      description: "アカウント編集",
      icon: <PersonIcon style={{ fontSize: fontSize.medium.medium }} />,
    },
  ];

  return (
    <div className={classes.subArea}>
      <div className={classes.subAreaInner}>
        {subAreaContents.map((item, i) => {
          const { func, description, icon } = item;
          return (
            <ButtonWithIcon
              key={i}
              onClick={func}
              description={description}
              icon={icon}
            />
          );
        })}
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  subArea: {
    height: "100%",
    width: baseStyle.subArea.width,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "30px",
  },
  subAreaInner: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "20px 0",
    boxShadow: shadow.main,
  },
  button: {
    fontSize: "1.4rem",
  },
});
