import {
  createUser,
  getToken,
  getUserInfo,
  updateUser,
  followUser as followUserByAPI,
  unfollowUser as unfollowUserByAPI,
  googleOauth,
} from "api/api";
import { useWSFollowInfo } from "dataService/userData";
import { createNotification } from "functions/notification";
import React from "react";
import { UserInterfaceAndUserFollowInterface } from "types/User";

interface UserContextInterface {
  user: UserInterfaceAndUserFollowInterface;
  setUser: React.Dispatch<
    React.SetStateAction<UserInterfaceAndUserFollowInterface>
  >;
  signup: (email: string, name: string, password: string) => Promise<any>;
  signin: (email: string, password: string) => Promise<any>;
  signinByGoogleOauth: (access_token: string) => Promise<any>;
  signout: () => void;
  editUser: (
    email: string,
    name: string,
    description?: string,
    isPrivate?: boolean,
    iconImage?: File,
    backgroundImage?: File
  ) => Promise<any>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
}

export const UserContext = React.createContext<UserContextInterface>(
  {} as UserContextInterface
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserInterfaceAndUserFollowInterface>({
    id: "",
    token: "",
    following: [],
    followers: [],
  });
  const { followingList, followerList } = useWSFollowInfo(user.id);

  // 初期化
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
        setUser((prev) => ({
          ...prev,
          ...userInfo,
          token,
        }));
      }
      if (!token && user?.email && user?.password) {
        token = await signin(user.email, user?.password);
      }
    };
    f();
  }, [user?.email, user?.password]);

  // websocket用
  React.useEffect(() => {
    setUser((prev) => ({
      ...prev,
      following: followingList ?? [],
      followers: followerList ?? [],
    }));
  }, [followingList, followerList]);

  const signinByGoogleOauth = async (access_token: string) => {
    const data = await googleOauth(access_token);
    const token = data.token;
    const userInfo = await getUserInfo(token);
    localStorage.setItem("token", token);
    return { ...userInfo, token };
  };

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
    window.location.href = "/auth";
    localStorage.clear();
    setUser({ id: "", token: "", following: [], followers: [] });
  };

  // [修正]
  //   変更前のuserと、引数が同じ場合はapiを叩かないようにしたい
  const editUser = async (
    email: string,
    name: string,
    description?: string,
    isPrivate?: boolean,
    iconImage?: File,
    backgroundImage?: File
  ) => {
    try {
      let token = localStorage.getItem("token");
      const userInfo = await updateUser(
        email,
        name,
        description ?? "",
        isPrivate ?? false,
        iconImage,
        backgroundImage,
        token ?? ""
      );
      setUser((prev) => ({ ...prev, ...userInfo, token }));
      return userInfo;
    } catch (error) {
      console.log("@editUser Error: ", error);
      throw error;
    }
  };

  const followUser = async (userId: string) => {
    await followUserByAPI(user.token, userId);
  };

  const unfollowUser = async (userId: string) => {
    await unfollowUserByAPI(user.token, userId);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        signup,
        signin,
        signinByGoogleOauth,
        signout,
        editUser,
        followUser,
        unfollowUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
