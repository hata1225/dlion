import { UserInterface } from "./User";
export type FileDataStatus = "none" | "video" | "image" | "pdf" | "audio";
export type VideoEncodeStatus = "not_encoded" | "m3u8" | "short" | "encoded";

export type FileData = {
  id: string;
  user?: UserInterface;
  title: string;
  description: string;
  created_at: string;
  categories: string[];
  cover_image?: string;
  main_data_size: string;
  main_data_type: FileDataStatus;
  main_data?: string;
  video_encode_status: VideoEncodeStatus;
  short_video_path: string;
  short_video_play_time: number;
};

export type FileDataByEdit = {
  id: string;
  title: string;
  description: string;
  categories: string[];
};
