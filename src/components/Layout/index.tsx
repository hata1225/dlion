import { makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { Header } from "components/Header";
import { SubArea } from "components/SubArea";
import React from "react";
import { baseStyle } from "theme";

interface Props {
  children?: React.ReactNode;
}

export const Layout = (props: Props) => {
  const { children } = props;
  const [isHiddenSubArea, setIsHiddenSubArea] = React.useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));

  React.useEffect(() => {
    const pathname = window.location.pathname;
    // if (pathname === "/auth" || pathname.match(/filedata/)) {
    if (pathname === "/auth" || isXs) {
      setIsHiddenSubArea(true);
    } else {
      setIsHiddenSubArea(false);
    }
  }, [isXs]);

  return (
    <>
      <Header />
      <main className={classes.main}>
        {isHiddenSubArea ? (
          <div className={classes.mainArea}>{children}</div>
        ) : (
          <>
            <SubArea />
            <div className={classes.mainArea}>{children}</div>
          </>
        )}
      </main>
    </>
  );
};

const useStyles = makeStyles({
  main: {
    height: `calc(100vh -  ${baseStyle.header.height})`,
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    alignItems: "center",
    padding: `0 ${baseStyle.pagePaddingHorizontal.main}`,
  },
  subArea: {
    height: "100%",
    width: baseStyle.subArea.width,
  },
  mainArea: {
    height: "100%",
    width: `calc(${baseStyle.maxWidthLayout.pc}px - ${baseStyle.subArea.width})`,
    overflow: "scroll",
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
});
