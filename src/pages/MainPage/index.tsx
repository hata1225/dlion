import { makeStyles } from "@material-ui/core";
import React from "react";
import { baseStyle } from "theme";

export const MainPage = () => {
  const classes = useStyles();
  return <div className={classes.mainPage}>mainarea</div>;
};

const useStyles = makeStyles({
  mainPage: {
    width: "100%",
    height: "100%",
  },
});
