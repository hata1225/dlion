import { Layout } from "components/Layout";
import { UserContext } from "contexts/UserContext";
import React from "react";
import { SignupAndSigninPage } from "pages/SignupAndSigninPage";
import { MainPage } from "pages/MainPage";

export const Home = () => {
  const { user } = React.useContext(UserContext);
  return (
    <Layout home>
      {user?.isSignin ? <MainPage /> : <SignupAndSigninPage />}
    </Layout>
  );
};
