import { createUser, getToken, getUserInfo } from "api/api";
import { createNotification } from "functions/notification";
import React from "react";
import { UserInterface } from "../types/User";

interface UserContextInterface {
  user?: UserInterface;
  setUser: React.Dispatch<React.SetStateAction<UserInterface | undefined>>;
  signup: (email: string, name: string, password: string) => Promise<any>;
  signin: (email: string, password: string) => Promise<any>;
  signout: () => void;
}

export const UserContext = React.createContext<UserContextInterface>(
  {} as UserContextInterface
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserInterface>();

  React.useEffect(() => {
    const f = async () => {
      let token = localStorage.getItem("token");
      if (
        !token &&
        !user?.email &&
        !user?.password &&
        window.location.pathname !== "/auth"
      ) {
        window.location.href = "/auth";
      }
      if (token) {
        const userInfo = await getUserInfo(token);
        setUser((prev) => ({ ...prev, ...userInfo, token }));
      }
      if (!token && user?.email && user?.password) {
        token = await signin(user.email, user?.password);
      }
    };
    f();
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      const token = await getToken(email, password);
      const userInfo = await getUserInfo(token);
      localStorage.setItem("token", token);
      return { ...userInfo, token };
    } catch (error) {
      console.log("@signin Error: ", error);
      createNotification("danger", "ログインに失敗しました");
      throw error;
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    try {
      await createUser(email, password, name);
      const userInfo = await signin(email, password);
      return userInfo;
    } catch (error) {
      console.log("@signup Error: ", error);
      throw error;
    }
  };

  const signout = () => {
    localStorage.clear();
    setUser({});
    window.location.href = "/auth";
  };

  return (
    <UserContext.Provider value={{ user, setUser, signup, signin, signout }}>
      {children}
    </UserContext.Provider>
  );
};
