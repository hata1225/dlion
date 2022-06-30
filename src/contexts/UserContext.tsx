import { User } from "@supabase/supabase-js";
import { createNotification } from "functions/notification";
import React from "react";

interface UserInterface {
  isSignin?: boolean;
  name?: string;
  email?: string;
  user_id?: string;
}

interface UserContextInterface {
  user?: UserInterface;
  setUser: React.Dispatch<React.SetStateAction<UserInterface | undefined>>;
  signup: (email: string, name: string, password: string) => Promise<any>;
  signin: (email: string, password: string) => Promise<User | null | undefined>;
}

export const UserContext = React.createContext<UserContextInterface>(
  {} as UserContextInterface
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserInterface>();

  React.useEffect(() => {
    const f = async () => {
      const userData = await supabase.auth.user();
      const user_id = userData?.id;
      if (user_id) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", user_id);
        if (data !== null && data.length > 0) {
          setUser({
            isSignin: true,
            name: data[0]?.name,
            email: data[0]?.email,
            user_id: data[0]?.user_id,
          });
        } else if (error) {
          setUser((prev) => ({ isSignin: false, ...prev }));
        }
      } else {
        setUser((prev) => ({ isSignin: false, ...prev }));
      }
    };
    f();
  }, []);

  const signin = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      createNotification("danger", `サインアップ失敗\nerror: ${error.message}`);
      return;
    }
    return user;
  };

  const signup = async (email: string, name: string, password: string) => {
    let errorMssage = "";
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (user) {
      const { data, error } = await supabase.from("users").insert([
        {
          user_id: user.id,
          name,
          email,
        },
      ]);
      if (data) {
        createNotification(
          "success",
          `サインアップ成功\nEmail: ${email}\nName: ${name}`
        );
        return data[0];
      }
      if (error) {
        errorMssage = error.message;
      }
    } else if (error) {
      errorMssage = error.message;
    }
    if (errorMssage)
      createNotification("danger", `サインアップ失敗\nerror: ${errorMssage}`);
  };

  return (
    <UserContext.Provider value={{ user, setUser, signup, signin }}>
      {children}
    </UserContext.Provider>
  );
};
