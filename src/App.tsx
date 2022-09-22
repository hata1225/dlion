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
import { FileDataProvider } from "contexts/FileDataContexts";
import { FileDataDetailPage } from "pages/FileDataDetailPage";
import { NotFoundPage } from "pages/NotFoundPage";
import { EditUserPage } from "pages/EditUserPage";

export default function App() {
  return (
    <UserProvider>
      <FileDataProvider>
        <PostModalProvider>
          <ReactNotifications />
          <Layout>
            <ReactRouter />
          </Layout>
        </PostModalProvider>
      </FileDataProvider>
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
        <Route path="/filedata/:id" element={<FileDataDetailPage />} />
        <Route path="/edituser" element={<EditUserPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
