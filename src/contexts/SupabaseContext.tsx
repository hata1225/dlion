import { createNotification } from "functions/notification";
import React from "react";
import { supabase } from "supabase";

interface SupabaseContextInterface {
  signup: (email: string, name: string, password: string) => Promise<any>;
}

export const SupabaseContext = React.createContext<SupabaseContextInterface>(
  {} as SupabaseContextInterface
);

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const signup = async (email: string, name: string, password: string) => {
    let errorMssage = "";
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (user) {
      const { data, error } = await supabase.from("users").insert([
        {
          accountId: user.id,
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
    <SupabaseContext.Provider value={{ signup }}>
      {children}
    </SupabaseContext.Provider>
  );
};
