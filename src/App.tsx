import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "pages/Home";
import { UserProvider } from "contexts/UserContext";
import "react-notifications-component/dist/theme.css";
import "animate.css/animate.min.css";

import { ReactNotifications } from "react-notifications-component";
import { SupabaseProvider } from "contexts/SupabaseContext";

export default function App() {
  return (
    <SupabaseProvider>
      <UserProvider>
        <ReactNotifications />
        <ReactRouter />
      </UserProvider>
    </SupabaseProvider>
  );
}

/**
 * ルーティング設定
 */
const ReactRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};
