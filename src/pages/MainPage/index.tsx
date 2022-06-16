import { makeStyles } from "@material-ui/core";
import React from "react";
import { baseStyle } from "theme";

export const MainPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.subArea}>subarea</div>
      <div className={classes.mainArea}>mainarea</div>
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  mainArea: {
    width: `calc(100vw - ${baseStyle.subArea.width})`,
  },
  subArea: {
    width: baseStyle.subArea.width,
  },
});
