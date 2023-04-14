import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "contexts/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-notifications-component/dist/theme.css";
import "animate.css/animate.min.css";

import { ReactNotifications } from "react-notifications-component";
import { SignupAndSigninPage } from "pages/SignupAndSigninPage";
import { PostModalProvider } from "contexts/PostModalContext";
import { FileDataProvider } from "contexts/FileDataContexts";
import { FileDataDetailPage } from "pages/FileDataDetailPage";
import { NotFoundPage } from "pages/NotFoundPage";
import { EditUserPage } from "pages/EditUserPage";
import { ChatPage } from "pages/ChatPage";
import { ProfilePage } from "pages/ProfilePage";
import { FilePage } from "pages/FilePage";
import { VideoCallModalModalProvider } from "contexts/VideoCallModalContext";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
      <UserProvider>
        <FileDataProvider>
          <PostModalProvider>
            <VideoCallModalModalProvider>
              <ReactNotifications />
              <ReactRouter />
            </VideoCallModalModalProvider>
          </PostModalProvider>
        </FileDataProvider>
      </UserProvider>
    </GoogleOAuthProvider>
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
