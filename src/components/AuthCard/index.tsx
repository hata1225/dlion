import { Button, Card, makeStyles } from "@material-ui/core";
import { BaseTextField } from "components/BaseTextField";
import { UserContext } from "contexts/UserContext";
import { createNotification } from "functions/notification";
import React from "react";
import { baseStyle } from "theme";

export const AuthCard = () => {
  const classes = useStyles();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [reinputPassword, setReinputPassword] = React.useState("");
  const [status, setStatus] = React.useState("signin");
  const [authCardContent, setAuthCardContent] = React.useState<any>();
  const { signup, signin } = React.useContext(UserContext);

  React.useEffect(() => {
    authCardContents.forEach((content, i) => {
      if (content.status === status) {
        const newAuthCardContent = authCardContents[i];
        setAuthCardContent(newAuthCardContent);
      }
    });
  }, [status, email, password, name]);

  const authCardContents = [
    {
      status: "signin",
      title: "ログイン",
      emailForm: true,
      nameForm: false,
      passwordForm: true,
      reinputPasswordForm: false,
      runButtonText: "ログインをする",
      runButtonFunc: async () => await handleClickSignin(),
      statusChangeButton: true,
      statusChangeButtonText: "アカウントを作成する→",
      statusChangeFunc: () => handleClickChangeStatus("signup"),
    },
    {
      status: "signup",
      title: "アカウントを作成",
      emailForm: true,
      nameForm: true,
      passwordForm: true,
      reinputPasswordForm: true,
      runButtonText: "アカウントを作成",
      runButtonFunc: async () => await handleClickSignup(),
      statusChangeButton: true,
      statusChangeButtonText: "作成済みのアカウントを使う→",
      statusChangeFunc: () => handleClickChangeStatus("signin"),
    },
    {
      status: "edit",
      title: "アカウントを編集",
      emailForm: true,
      nameForm: true,
      passwordForm: false,
      reinputPasswordForm: false,
      runButtonText: "アカウントを編集",
      runButtonFunc: async () => await handleClickEdit(),
      statusChangeButton: false,
      statusChangeButtonText: "",
      statusChangeFunc: () => handleClickChangeStatus(""),
    },
  ];

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
    console.log("value: ", email, password);
    const userInfo = await signin(email, password);
    if (userInfo) {
      window.location.href = "/";
    }
  };

  const handleClickEdit = async () => {
    console.log("アカウントを変更");
  };

  const handleClickChangeStatus = (status: string) => {
    setStatus(status);
  };

  return (
    <Card className={classes.card}>
      <h2>{authCardContent?.title}</h2>
      <div className={classes.inputTextArea}>
        {authCardContent?.emailForm && (
          <BaseTextField
            label="メールアドレス"
            variant="outlined"
            type="email"
            value={email}
            setValue={setEmail}
          />
        )}
        {authCardContent?.nameForm && (
          <BaseTextField
            label={
              name.match(/^[A-Za-z0-9]*$/)
                ? "名前（半角英数）"
                : "名前 半角英数で入力してください（記号不可）"
            }
            variant="outlined"
            value={name}
            setValue={setName}
            error={!name.match(/^[A-Za-z0-9]*$/)}
          />
        )}
        {authCardContent?.passwordForm && (
          <BaseTextField
            label="パスワード 8文字以上"
            variant="outlined"
            type="password"
            value={password}
            setValue={setPassword}
          />
        )}
        {authCardContent?.reinputPasswordForm && (
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
          onClick={async () => await authCardContent.runButtonFunc()}
          variant="contained"
          color="primary"
        >
          <p>{authCardContent?.runButtonText}</p>
        </Button>
        <Button
          onClick={authCardContent?.statusChangeFunc}
          color="primary"
          className={classes.bottomLink}
        >
          {authCardContent?.statusChangeButtonText}
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
