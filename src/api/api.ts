import axios, { AxiosRequestConfig } from "axios";
import { FileData, FileDataByEdit } from "types/fileData";

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
    if (data[objectKey] === false || data[objectKey]) {
      formData.append(`${objectKey}`, data[objectKey]);
    }
  });
  return formData;
};

export const postAxios = async (
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
      `${path}`,
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
    postProps = [`${path}`, formData, undefined];
  }
  try {
    console.log("postProps: ", postProps);
    return await axios.post(...postProps);
  } catch (error) {
    console.log("[POST] Error: ", error);
    throw error;
  }
};

export const patchAxios = async (path: string, data: object, token: string) => {
  axios.defaults.withCredentials = false;
  let patchProps: [string, any, AxiosRequestConfig<any> | undefined];
  let formData = createFormData(data);
  if (token) {
    patchProps = [
      `${path}`,
      formData,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    ];
  } else {
    patchProps = [`${path}`, formData, undefined];
  }

  try {
    console.log("patchProps: ", patchProps);
    return await axios.patch(...patchProps);
  } catch (error) {
    console.log("[PATCH] Error: ", error);
    throw error;
  }
};

export const getAxios = async (path: string, token: string) => {
  axios.defaults.withCredentials = false;
  let getProps: [string, AxiosRequestConfig<any> | undefined];
  const isPathMatchByHttp = path.match(/http:/);
  if (token) {
    getProps = [
      `${path}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    ];
  } else {
    getProps = [`${path}`, undefined];
  }
  if (isPathMatchByHttp) {
    getProps[0] = path;
  }
  try {
    return await axios.get(...getProps);
  } catch (error) {
    console.log("[GET] Error: ", error);
    throw error;
  }
};

export const getAxiosByMainDataBlob = async (path: string, token: string) => {
  axios.defaults.withCredentials = false;
  let getProps: [string, AxiosRequestConfig<any> | undefined];
  if (token) {
    getProps = [
      `${path}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    ];
  } else {
    getProps = [`${path}`, { responseType: "blob" }];
  }
  try {
    return await axios.get(...getProps);
  } catch (error) {
    console.log("[GET] Error: ", error);
    throw error;
  }
};

export const deleteAxios = async (path: string, token: string) => {
  axios.defaults.withCredentials = false;
  let deleteProps: [string, AxiosRequestConfig<any> | undefined];
  if (token) {
    deleteProps = [
      `${path}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    ];
  } else {
    deleteProps = [`${path}`, undefined];
  }
  try {
    return await axios.delete(...deleteProps);
  } catch (error) {
    console.log("[DELETE] Error: ", error);
    throw error;
  }
};

export const getToken = async (email: string, password: string) => {
  const path = "/api/user/token/";
  const data = { email, password };
  try {
    const result = await postAxios(path, data);
    return result?.data?.token;
  } catch (error) {
    console.log("@getToken Error: ", error);
    throw error;
  }
};

export const getUserInfo = async (token: string) => {
  const path = "/api/user/update/";
  try {
    const result = await getAxios(path, token);
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
  const path = "/api/user/create/";
  const data = {
    email,
    password,
    name,
  };
  try {
    await postAxios(path, data);
  } catch (error) {
    console.log("@createUser Error: ", error);
    throw error;
  }
};

export const updateUser = async (
  email: string,
  name: string,
  description: string | undefined,
  isPrivate: boolean,
  iconImage: File | undefined,
  backgroundImage: File | undefined,
  token: string
) => {
  const path = "/api/user/update/";
  const data = {
    email,
    name,
    description: description ?? "",
    is_private: isPrivate,
    icon_image: iconImage ?? null,
    background_image: backgroundImage ?? null,
  };
  try {
    const result = await patchAxios(path, data, token);
    return result?.data;
  } catch (error) {
    console.log("@updateUser: ", error);
    throw error;
  }
};

export const getCategories = async (token: string) => {
  const path = "/api/categories/";
  try {
    const result = await getAxios(path, token);
    return result?.data;
  } catch (error) {
    console.log("@getCategories: ", error);
    throw error;
  }
};

export const getAllFileData = async (token: string) => {
  const path = "/api/file_data/";
  try {
    const result = await getAxios(path, token);
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

export const getFileData = async (token: string, id: string) => {
  const path = `/api/file_data/${id}/`;
  try {
    const result = await getAxios(path, token);
    const fileData: FileData = result.data;
    fileData.video_data_status = JSON.parse(result.data.video_data_status);
    fileData.categories = JSON.parse(result.data.categories);
    return fileData;
  } catch (error) {
    console.log("@getFileData: ", error);
    throw error;
  }
};

export const patchFileData = async (data: FileDataByEdit, token: string) => {
  const path = `/api/file_data/${data.id}/`;
  const newData = {
    title: data.title,
    description: data.description,
    categories: JSON.stringify(data.categories),
  };
  try {
    const result = await patchAxios(path, newData, token);
    return result;
  } catch (error) {
    console.log("@patchFileData: ", error);
    throw error;
  }
};

export const deleteFileData = async (token: string, id: string) => {
  const path = `/api/file_data/${id}/`;
  try {
    const result = await deleteAxios(path, token);
    return result;
  } catch (error) {
    console.log("@deleteFileData: ", error);
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
  const path = "/api/file_data/";
  try {
    const result = await postAxios(
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

export const getMainDataByBlob = async (fileData: FileData, token: string) => {
  const path = fileData?.main_data ?? "";
  try {
    const result = await getAxiosByMainDataBlob(path, token);
    return result.data;
  } catch (error) {
    console.log("@getMainData: ", error);
    throw error;
  }
};

/**
 * google認証のための関数
 * @param response
 * @returns
 */
export const googleOauth = async (response: any) => {
  const path = "http://localhost:8000/auth/convert-token";
  const data = {
    token: response.access_token,
    backend: "google-oauth2",
    grant_type: "convert_token",
    client_id: process.env.REACT_APP_DRF_GOOGLE_OAUTH_CLIENT_ID,
    client_secret: process.env.REACT_APP_DRF_GOOGLE_OAUTH_CLIENT_SECRET,
  };
  console.log("@googleOauth sendData: ", data);
  try {
    const result = await postAxios(path, data);
    return result.data;
  } catch (error) {
    console.log("@googleOauth: ", error);
    throw error;
  }
};
