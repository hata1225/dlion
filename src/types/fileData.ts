import { UserInterface } from "./User";
export type FileDataStatus = "none" | "video" | "image" | "pdf" | "audio";

export type FileData = {
  user: UserInterface;
  title: string;
  description: string;
  created_at: string;
  categories: string[];
  cover_image: string;
  main_data_size: string;
  main_data_type: FileDataStatus;
  video_data: string;
  video_data_status: string;
  short_video_path: string;
};
