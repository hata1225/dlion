import { SignupAndSigninCard } from "components/SignupAndSigninCard";
import { makeStyles } from "@material-ui/core";

export const SignupAndSigninPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <SignupAndSigninCard />
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
