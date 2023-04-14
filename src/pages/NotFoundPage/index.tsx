import { Link, makeStyles } from "@material-ui/core";
import { Layout } from "components/Layout";
import { NotFound404Lottie } from "components/LottieComponents/NotFound404Lottie";
import { baseStyle } from "theme";

export const NotFoundPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.notFoundPage}>
        <div className={classes.notFoundPageContentArea}>
          <div className={classes.headingArea}>
            <h2 className={classes.heading}>ページが見つかりませんでした。</h2>
            <Link className={classes.homePageTransition} href="/">
              ホーム画面へ
            </Link>
          </div>
          <div>
            <NotFound404Lottie />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const useStyles = makeStyles({
  notFoundPage: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundPageContentArea: {
    width: "calc(100% - 30px)",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
  },
  headingArea: {
    paddingLeft: "7%",
    paddingTop: "80px",
    width: "100%",
  },
  heading: {
    color: baseStyle.color.purple.dark,
  },
  homePageTransition: {
    color: baseStyle.color.purple.dark,
  },
});
