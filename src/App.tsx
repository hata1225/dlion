import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "contexts/UserContext";
import "react-notifications-component/dist/theme.css";
import "animate.css/animate.min.css";

import { ReactNotifications } from "react-notifications-component";
import { Layout } from "components/Layout";
import { SignupAndSigninPage } from "pages/SignupAndSigninPage";
import { PostModalProvider } from "contexts/PostModalContext";
import { FileDataProvider } from "contexts/FileDataContexts";
import { FileDataDetailPage } from "pages/FileDataDetailPage";
import { NotFoundPage } from "pages/NotFoundPage";
import { EditUserPage } from "pages/EditUserPage";
import { ChatPage } from "pages/ChatPage";
import { ProfilePage } from "pages/ProfilePage";
import { FilePage } from "pages/FilePage";

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
        <Route path="/" element={<FilePage />} />
        <Route path="/auth" element={<SignupAndSigninPage />} />
        <Route path="/filedata/:id" element={<FileDataDetailPage />} />
        <Route path="/edituser" element={<EditUserPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
