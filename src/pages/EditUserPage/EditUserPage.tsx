import { makeStyles } from "@material-ui/core";
import React from "react";
import { baseStyle } from "theme";

export const EditUserPage = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.editUserPage}></div>
    </>
  );
};

const useStyles = makeStyles({
  editUserPage: {
    height: "100%",
    width: "100%",
    backgroundColor: baseStyle.color.gray.main,
  },
});
