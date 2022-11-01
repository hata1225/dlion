import { Button, Card, makeStyles, Switch } from "@material-ui/core";
import { BaseTextField } from "components/BaseTextField";
import { UserContext } from "contexts/UserContext";
import { createNotification } from "functions/notification";
import React from "react";
import { baseStyle } from "theme";
import { ImageArea } from "./ImageArea";
import { GoogleLogin } from "@react-oauth/google";
import userIconImageDefault from "userIconImageDefault.webp";
import jwt_decode from "jwt-decode";

interface Props {
  statusProp?: "signin" | "signup" | "edit";
}

export const AuthCard = ({ statusProp }: Props) => {
  const classes = useStyles();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [userBackgroundImage, setUserBackgroundImage] = React.useState<File>();
  const [userBackgroundImageUrl, setUserBackgroundImageUrl] =
    React.useState<string>();
  const [userIconImage, setUserIconImage] = React.useState<File>();
  const [userIconImageUrl, setUserIconImageUrl] = React.useState<string>();
  const [password, setPassword] = React.useState("");
  const [reinputPassword, setReinputPassword] = React.useState("");
  const [status, setStatus] = React.useState("signin");
  const [authCardContent, setAuthCardContent] = React.useState<any>();
  const { signup, signin, user, editUser } = React.useContext(UserContext);

  React.useEffect(() => {
    authCardContents.forEach((content, i) => {
      if (content.status === status) {
        const newAuthCardContent = authCardContents[i];
        setAuthCardContent(newAuthCardContent);
      }
    });
  }, [
    status,
    email,
    password,
    name,
    description,
    isPrivate,
    userBackgroundImage,
    userIconImage,
  ]);

  React.useEffect(() => {
    if (statusProp) {
      if (statusProp === "edit" && user?.email && user?.name) {
        setEmail(user?.email);
        setName(user?.name);
        setDescription(user.description ?? "");
        setIsPrivate(user.is_private ?? false);
        setUserBackgroundImageUrl(user?.background_image);
        setUserIconImageUrl(user?.icon_image ?? userIconImageDefault);
      }
      setStatus(statusProp);
    }
  }, [statusProp, user]);

  const authCardContents = [
    {
      status: "signin",
      title: "ログイン",
      emailForm: true,
      passwordForm: true,
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
      imageArea: true,
      descriptionForm: true,
      emailForm: true,
      nameForm: true,
      isPrivateSwitch: true,
      runButtonText: "アカウントを編集",
      runButtonFunc: async () => await handleClickEdit(),
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
    const userInfo = await signin(email, password);
    if (userInfo) {
      window.location.href = "/";
    }
  };

  const handleClickEdit = async () => {
    try {
      if (editUser) {
        const userInfo = await editUser(
          email,
          name,
          description,
          isPrivate,
          userIconImage,
          userBackgroundImage
        );
        if (userInfo) {
          createNotification("success", "アカウントを編集しました");
        }
      }
    } catch (error) {
      console.log("@handleClickEdit: ", error);
      createNotification("danger", "アカウントの編集に失敗しました");
    }
  };

  const handleClickChangeStatus = (status: string) => {
    setStatus(status);
  };

  return (
    <Card className={classes.card}>
      <h2>{authCardContent?.title}</h2>
      <div className={classes.inputTextArea}>
        {authCardContent?.imageArea && (
          <ImageArea
            setUserBackgroundImage={setUserBackgroundImage}
            setUserBackgroundImageUrl={setUserBackgroundImageUrl}
            userBackgroundImageUrl={userBackgroundImageUrl}
            setUserIconImage={setUserIconImage}
            setUserIconImageUrl={setUserIconImageUrl}
            userIconImageUrl={userIconImageUrl}
          />
        )}
        {authCardContent?.nameForm && (
          <BaseTextField
            label={
              name.match(/^[A-Za-z0-9]*$/)
                ? name.length > 50
                  ? `名前 50文字以内で入力してください (${name.length}/50)`
                  : "名前（半角英数）"
                : "名前 半角英数で入力してください（記号不可）"
            }
            variant="outlined"
            value={name}
            setValue={setName}
            error={!name.match(/^[A-Za-z0-9]*$/) || name.length > 50}
          />
        )}
        {authCardContent?.descriptionForm && (
          <BaseTextField
            label={`自己紹介 (${description?.length ?? 0}/255)`}
            variant="outlined"
            value={description}
            setValue={setDescription}
            multiline
            minRows={3}
            maxRows={3}
            error={description ? description.length > 255 : false}
          />
        )}
        {authCardContent?.emailForm && (
          <BaseTextField
            label="メールアドレス"
            variant="outlined"
            type="email"
            value={email}
            setValue={setEmail}
          />
        )}
        {authCardContent?.isPrivateSwitch && (
          <div className={classes.isPrivateArea}>
            <p>アカウントをプライベートにする</p>
            <Switch
              checked={isPrivate}
              onChange={() => setIsPrivate((prev) => !prev)}
              color="primary"
            />
          </div>
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
        <GoogleLogin
          onSuccess={(response: any) => {
            let responsePayload = jwt_decode(response?.credential);
            console.log(responsePayload);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
          size="large"
        />
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
  isPrivateArea: {
    padding: "10px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
