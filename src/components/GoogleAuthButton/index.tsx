import { Button, makeStyles } from "@material-ui/core";
import { useGoogleLogin } from "@react-oauth/google";
import { googleOauth } from "api/api";
import { ReactComponent as GoogleIcon } from "./google.svg";
import React from "react";
import { UserContext } from "contexts/UserContext";

interface Props {
  text?: string;
}

export const GoogleAuthButton = ({ text = "googleでログイン" }: Props) => {
  const classes = useStyles();
  const { signinByGoogleOauth } = React.useContext(UserContext);
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      await signinByGoogleOauth(tokenResponse.access_token);
      window.location.href = "/";
    },
  });

  return (
    <Button
      className={classes.googleAuthButton}
      variant="outlined"
      onClick={async () => await login()}
      fullWidth
    >
      <div className={classes.googleAuthButtonInner}>
        <GoogleIcon width={20} height={20} />
        <p>{text}</p>
      </div>
    </Button>
  );
};

const useStyles = makeStyles({
  googleAuthButton: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  googleAuthButtonInner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textTransform: "none",
  },
});
