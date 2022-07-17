import { makeStyles } from "@material-ui/core";
import React from "react";
import { baseStyle, shadow } from "theme";

export const Header = () => {
  const classes = useStyles();
  return (
    <header className={classes.header}>
      <div className={classes.headerInner}>
        <div>
          <h1 className={classes.heading}>DLion</h1>
        </div>
        <div></div>
      </div>
    </header>
  );
};

const useStyles = makeStyles({
  header: {
    height: baseStyle.header.height,
    backgroundColor: baseStyle.color.purple.main,
    display: "flex",
    justifyContent: "center",
    boxShadow: shadow.main,
  },
  headerInner: {
    height: "100%",
    width: `${baseStyle.maxWidthLayout.pc}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `0 ${baseStyle.pagePaddingHorizontal.main}`,
  },
  heading: {
    color: baseStyle.color.white.light,
  },
});
