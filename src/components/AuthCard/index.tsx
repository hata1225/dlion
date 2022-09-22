import { Button, Card, makeStyles } from "@material-ui/core";
import { BaseTextField } from "components/BaseTextField";
import { UserContext } from "contexts/UserContext";
import { createNotification } from "functions/notification";
import React from "react";
import { baseStyle } from "theme";

export const AuthCard = () => {
  const classes = useStyles();
  const [isSigninCard, setIsSigninCard] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [reinputPassword, setReinputPassword] = React.useState("");
  const { signup, signin } = React.useContext(UserContext);

  const handleClickSignup = async () => {
    if (password !== reinputPassword) {
      createNotification("danger", "パスワードが一致しません");
      return;
    }
    if (password.length < 8) {
      createNotification("danger", "パスワードは8文字以上入力してください");
      return;
    }
    await signup(email, name, password);
    window.location.href = "/";
  };

  const handleClickSignin = async () => {
    const userInfo = await signin(email, password);
    if (userInfo) {
      window.location.href = "/";
    }
  };

  return (
    <Card className={classes.card}>
      <h2>{isSigninCard ? "ログイン" : "アカウントを作成"}</h2>
      <div className={classes.inputTextArea}>
        <BaseTextField
          label="メールアドレス"
          variant="outlined"
          type="email"
          value={email}
          setValue={setEmail}
        />
        {isSigninCard ? (
          <></>
        ) : (
          <BaseTextField
            label={
              name.match(/^[A-Za-z0-9]*$/)
                ? "名前（半角英数）"
                : "名前 半角英数で入力してください"
            }
            variant="outlined"
            value={name}
            setValue={setName}
            error={!name.match(/^[A-Za-z0-9]*$/)}
          />
        )}
        <BaseTextField
          label="パスワード 8文字以上"
          variant="outlined"
          type="password"
          value={password}
          setValue={setPassword}
        />
        {isSigninCard ? (
          <></>
        ) : (
          <BaseTextField
            label="パスワード（再入力）"
            variant="outlined"
            type="password"
            value={reinputPassword}
            setValue={setReinputPassword}
          />
        )}
      </div>
      <div className={classes.bottomArea}>
        <Button
          onClick={isSigninCard ? handleClickSignin : handleClickSignup}
          variant="contained"
          color="primary"
        >
          <p>{isSigninCard ? "ログインをする" : "アカウントを作成"}</p>
        </Button>
        <Button
          onClick={() => setIsSigninCard((prev) => !prev)}
          color="primary"
          className={classes.bottomLink}
        >
          {isSigninCard
            ? "アカウントを作成する→"
            : "作成済みのアカウントを使う→"}
        </Button>
      </div>
    </Card>
  );
};

const useStyles = makeStyles({
  card: {
    width: baseStyle.card.width,
    padding: baseStyle.card.padding,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
  },
  inputTextArea: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  bottomArea: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  bottomLink: {
    fontSize: "1.2rem",
  },
});
