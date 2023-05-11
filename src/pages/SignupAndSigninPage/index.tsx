import { AuthCard } from "components/AuthCard";
import { makeStyles } from "@material-ui/core";
import { Layout } from "components/Layout";

export const SignupAndSigninPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.signupAndSigninPage}>
        <AuthCard />
      </div>
    </Layout>
  );
};

const useStyles = makeStyles({
  signupAndSigninPage: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
