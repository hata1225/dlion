import axios, { AxiosRequestConfig } from "axios";
import { FileData } from "types/fileData";

const ENVS = {
  develop: "localhost",
};

export const ENV = `http://${ENVS.develop}`; // 環境ごとに変更

axios.defaults.baseURL = `${ENV}:8000`;
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = `${ENV}:3000`;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const createFormData = (data: any) => {
  let formData = new FormData();
  const objectKeys = Object.keys(data);
  objectKeys.forEach((objectKey) => {
    formData.append(`${objectKey}`, data[objectKey]);
  });
  return formData;
};

export const post = async (
  path: string,
  data: object,
  token?: string,
  setUploadProgressValue?: React.Dispatch<React.SetStateAction<number>> | null,
  endOfUploadFunc?: undefined
) => {
  axios.defaults.withCredentials = false;
  let postProps: [
    string,
    object | undefined,
    AxiosRequestConfig<object> | undefined
  ];
  const formData = createFormData(data);
  if (token) {
    postProps = [
      `/api${path}`,
      formData,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
        onUploadProgress: async (ProgressEvent: {
          total: number;
          loaded: number;
        }) => {
          if (setUploadProgressValue) {
            let total = ProgressEvent.total;
            let loaded = ProgressEvent.loaded;
            let percentCompleted = (loaded / total) * 100;
            setUploadProgressValue(percentCompleted);
            if (endOfUploadFunc && percentCompleted === 100) {
              setTimeout(endOfUploadFunc, 500);
            }
          }
        },
      },
    ];
  } else {
    postProps = [`api${path}`, formData, undefined];
  }
  try {
    console.log("postProps: ", postProps);
    return await axios.post(...postProps);
  } catch (error) {
    console.log("[POST] Error: ", error);
    throw error;
  }
};

export const patch = async (path: string, data: object, token: string) => {
  axios.defaults.withCredentials = false;
  let patchProps: [string, any, AxiosRequestConfig<any> | undefined];
  let formData = createFormData(data);
  if (token) {
    patchProps = [
      `/api${path}`,
      formData,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    ];
  } else {
    patchProps = [`/api${path}`, formData, undefined];
  }

  try {
    console.log("patchProps: ", patchProps);
    return await axios.patch(...patchProps);
  } catch (error) {
    console.log("[PATCH] Error: ", error);
    throw error;
  }
};

export const get = async (path: string, token: string) => {
  axios.defaults.withCredentials = false;
  let getProps: [string, AxiosRequestConfig<any> | undefined];
  if (token) {
    getProps = [
      `/api${path}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    ];
  } else {
    getProps = [`/api${path}`, undefined];
  }
  try {
    return await axios.get(...getProps);
  } catch (error) {
    console.log("[GET] Error: ", error);
    throw error;
  }
};

export const getToken = async (email: string, password: string) => {
  const path = "/user/token/";
  const data = { email, password };
  try {
    const result = await post(path, data);
    return result?.data?.token;
  } catch (error) {
    console.log("@getToken Error: ", error);
    throw error;
  }
};

export const getUserInfo = async (token: string) => {
  const path = "/user/update/";
  try {
    const result = await get(path, token);
    return result?.data;
  } catch (error) {
    console.log("@getUserInfo: ", error);
    if (window.location.pathname !== "/auth") {
      localStorage.clear();
      window.location.href = "/auth";
    }
    throw error;
  }
};

export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  const path = "/user/create/";
  const data = {
    email,
    password,
    name,
  };
  try {
    await post(path, data);
  } catch (error) {
    console.log("@createUser Error: ", error);
    throw error;
  }
};

export const updateUser = async (
  email: string,
  name: string,
  token: string
) => {
  const path = "/user/update/";
  const data = { email, name };
  try {
    const result = await patch(path, data, token);
    return result;
  } catch (error) {
    console.log("@updateUser: ", error);
    throw error;
  }
};

export const getCategories = async (token: string) => {
  const path = "/categories/";
  try {
    const result = await get(path, token);
    return result?.data;
  } catch (error) {
    console.log("@getCategories: ", error);
    throw error;
  }
};

export const getAllFileData = async (token: string) => {
  const path = "/file_data/";
  try {
    const result = await get(path, token);
    const fileData: FileData[] = result.data.results;
    fileData.forEach((item: any) => {
      item.categories = JSON.parse(item.categories);
      item.video_data_status = JSON.parse(item.video_data_status);
    });
    return result?.data?.results;
  } catch (error) {
    console.log("@getAllFileData: ", error);
    throw error;
  }
};

export const getFileData = async (token: string, id: number) => {
  const path = `/file_data/${id}/`;
  try {
    const result = await get(path, token);
    const fileData: FileData = result.data;
    fileData.video_data_status = JSON.parse(fileData.video_data_status);
    return fileData;
  } catch (error) {
    console.log("@getFileData: ", error);
    throw error;
  }
};

/**
 * fileDataをpostする際に使うapi
 * @param data
 * @param token
 * @param setUploadProgressValue
 * @param endOfUploadFunc
 * @returns
 */
export const postFileData = async (
  data: object,
  token: string,
  setUploadProgressValue?: React.Dispatch<React.SetStateAction<number>> | null,
  endOfUploadFunc?: any
) => {
  const path = "/file_data/";
  try {
    const result = await post(
      path,
      data,
      token,
      setUploadProgressValue,
      endOfUploadFunc
    );
    return result;
  } catch (error) {
    console.log("@postFileData: ", error);
    throw error;
  }
};
