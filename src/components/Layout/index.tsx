import { makeStyles } from "@material-ui/core";
import { Header } from "components/Header";
import { SubArea } from "components/SubArea";
import React from "react";
import { baseStyle } from "theme";
import { UserContext } from "../../contexts/UserContext";

interface Props {
  children?: React.ReactNode;
  isAuthPage?: boolean;
}

export const Layout = (props: Props) => {
  const { children, isAuthPage } = props;
  const classes = useStyles();

  return (
    <>
      <Header />
      <main className={classes.main}>
        {window.location.pathname === "/auth" ? <></> : <SubArea />}
        <div className={classes.mainArea}>{children}</div>
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
  subArea: {
    height: "100%",
    width: baseStyle.subArea.width,
  },
  mainArea: {
    height: "100%",
    width: `calc(${baseStyle.maxWidthLayout.pc} - ${baseStyle.subArea.width})`,
  },
});
