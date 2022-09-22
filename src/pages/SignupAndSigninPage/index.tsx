import { AuthCard } from "components/AuthCard";
import { makeStyles } from "@material-ui/core";

export const SignupAndSigninPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.signupAndSigninPage}>
      <AuthCard />
    </div>
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
