import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "contexts/UserContext";
import "react-notifications-component/dist/theme.css";
import "animate.css/animate.min.css";

import { ReactNotifications } from "react-notifications-component";
import { Layout } from "components/Layout";
import { MainPage } from "pages/MainPage";
import { SignupAndSigninPage } from "pages/SignupAndSigninPage";
import { PostModalProvider } from "contexts/PostModalContext";

export default function App() {
  return (
    <UserProvider>
      <PostModalProvider>
        <ReactNotifications />
        <Layout>
          <ReactRouter />
        </Layout>
      </PostModalProvider>
    </UserProvider>
  );
}

/**
 * ルーティング設定
 */
const ReactRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<SignupAndSigninPage />} />
      </Routes>
    </BrowserRouter>
  );
};
