import { makeStyles } from "@material-ui/core";
import { baseStyle, fontSize, shadow, fontWeight } from "theme";

export const Header = () => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <div className={classes.headerInner}>
        <div>
          <a className={classes.heading} href={"/"}>
            DLion
          </a>
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
    fontSize: fontSize.large.large,
    fontWeight: fontWeight.bold,
    color: baseStyle.color.white.light,
    cursor: "pointer",
  },
});
