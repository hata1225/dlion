import { SignupAndSigninCard } from "components/SignupAndSigninCard";
import { makeStyles } from "@material-ui/core";

export const SignupAndSigninPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.signupAndSigninPage}>
      <SignupAndSigninCard />
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
