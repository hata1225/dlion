import { makeStyles } from "@material-ui/core";
import { supabase } from "supabase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { fontSize, baseStyle, shadow } from "theme";
import React from "react";
import { PostModalContext } from "contexts/PostModalContext";

type SubAreaContents = {
  func: any;
  description: string;
  icon: React.ReactNode;
}[];

export const SubArea = () => {
  const classes = useStyles();
  const { handleOpenPostModal } = React.useContext(PostModalContext);

  const handleClickSignout = () => {
    supabase.auth.signOut();
    window.location.href = "/auth";
  };

  const subAreaContents: SubAreaContents = [
    {
      func: handleClickSignout,
      description: "ログアウト",
      icon: <ExitToAppIcon style={{ fontSize: fontSize.medium.medium }} />,
    },
    {
      func: handleOpenPostModal,
      description: "投稿する",
      icon: <CloudUploadIcon style={{ fontSize: fontSize.medium.medium }} />,
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
