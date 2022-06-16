import { makeStyles } from "@material-ui/core";
import React from "react";
import { baseStyle } from "theme";

export const Header = () => {
  const classes = useStyles();
  return (
    <header className={classes.header}>
      <div className={classes.headerInner}>
        <div>
          <h1>DLion</h1>
        </div>
        <div></div>
      </div>
    </header>
  );
};

const useStyles = makeStyles({
  header: {
    height: baseStyle.header.height,
    backgroundColor: "#888",
    display: "flex",
    justifyContent: "center",
  },
  headerInner: {
    height: "100%",
    width: baseStyle.maxWidthLayout.pc,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
