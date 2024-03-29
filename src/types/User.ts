export interface UserInterface {
  id: string;
  name?: string;
  password?: string;
  email?: string;
  token: string;
  is_private?: boolean;
  icon_image?: string;
  background_image?: string;
  description?: string;
}

export interface UserFollowInterface {
  following: UserInterface[];
  followers: UserInterface[];
}

export type UserInterfaceAndUserFollowInterface = UserInterface & UserFollowInterface;
