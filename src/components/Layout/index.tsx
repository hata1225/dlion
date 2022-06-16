import { makeStyles } from "@material-ui/core";
import { Header } from "components/Header";
import React from "react";
import { baseStyle } from "theme";

interface Props {
  children?: React.ReactNode;
  home?: boolean;
}

export const Layout = (props: Props) => {
  const { children, home } = props;
  const classes = useStyles();
  return (
    <>
      <Header />
      <main className={classes.main}>
        <div className={classes.mainInner}>{children}</div>
      </main>
    </>
  );
};

const useStyles = makeStyles({
  main: {
    height: `calc(100vh -  ${baseStyle.header.height})`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mainInner: {
    height: "100%",
    width: baseStyle.maxWidthLayout.pc,
  },
});
