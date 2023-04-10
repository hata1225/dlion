import axios, { AxiosRequestConfig } from "axios";
import { FileData, FileDataByEdit } from "types/fileData";

export const ENVS = {
  develop: `${process.env.REACT_APP_IP_ADDRESS}`,
  develop2: "192.168.11.7",
};

export const ENV = `${ENVS.develop2}`; // 環境ごとに変更

axios.defaults.baseURL = `http://${ENV}:8000`;
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.common[
  "Access-Control-Allow-Origin"
] = `http://${ENV}:3000`;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export const createFormData = (data: any) => {
  let formData = new FormData();
  const objectKeys = Object.keys(data);
  objectKeys.forEach((objectKey) => {
    const value = data[objectKey];
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        formData.append(`${objectKey}[${i}]`, v); // arrayデータを分割して入れ直す
      });
    } else if (value === false || value) {
      // valueがfalse or valueがtruthy
      formData.append(`${objectKey}`, value);
    }
  });
  return formData;
};

export const postAxios = async (
  path: string,
  data: object,
  token?: string,
  setUploadProgressValue?: React.Dispatch<React.SetStateAction<number>> | null,
  endOfUploadFunc?: any
) => {
  axios.defaults.withCredentials = false;
  let postProps: [string, FormData, AxiosRequestConfig<object> | undefined];
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
          total?: number;
          loaded?: number;
        }) => {
          let total = ProgressEvent?.total;
          let loaded = ProgressEvent?.loaded;
          if (setUploadProgressValue && total && loaded) {
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
  let patchProps: [string, FormData, AxiosRequestConfig<any> | undefined];
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

export const getUserInfo = async (token: string, id?: string) => {
  let path = "";
  if (id) {
    path = `/api/user/get/${id}/`;
  } else {
    path = "/api/user/update/";
  }
  try {
    const result = await getAxios(path, token);
    return result?.data;
  } catch (error) {
    console.log("@getUserInfo: ", error);
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
    });
    return result?.data?.results;
  } catch (error) {
    console.log("@getAllFileData: ", error);
    throw error;
  }
};

export const getFileDataByUserId = async (token: string, user_id: string) => {
  let path = "/api/file_data/";
  if (user_id) {
    path = `/api/file_data/?user_id=${user_id}`;
  }
  try {
    const result = await getAxios(path, token);
    const fileData: FileData[] = result.data.results;
    fileData.forEach((item: any) => {
      item.categories = JSON.parse(item.categories);
    });
    return result?.data?.results;
  } catch (error) {
    console.log("@getMineFileData: ", error);
    throw error;
  }
};

export const getFileData = async (token: string, id: string) => {
  const path = `/api/file_data/${id}/`;
  try {
    const result = await getAxios(path, token);
    const fileData: FileData = result.data;
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
  setUploadProgressValue?: React.Dispatch<React.SetStateAction<number>>,
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
 * フォロー機能
 * @param token
 * @param userId
 * @returns
 */
export const followUser = async (token: string, userId: string) => {
  const path = `/api/user/follow/?user_id=${userId}`;
  const data = {
    user_id: userId,
  };
  try {
    const result = await postAxios(path, data, token);
    return result.data;
  } catch (error) {
    console.log(`@followUser: `, error);
    throw error;
  }
};

/**
 * フォローを外す機能
 * @param token
 * @param userId
 * @returns
 */
export const unfollowUser = async (token: string, userId: string) => {
  const path = `/api/user/unfollow/?user_id=${userId}`;
  try {
    const result = await deleteAxios(path, token);
    return result.data;
  } catch (error) {
    console.log(`@unfollowUser: `, error);
    throw error;
  }
};

/**
 * currentUserがフォローしているユーザー一覧
 * @param token
 */
export const getFollowingListByCurrentUser = async (token: string) => {
  const path = `/api/user/followinglist/`;
  try {
    const result = await getAxios(path, token);
    return result.data;
  } catch (error) {
    console.log("@getFollowingListByCurrentUser: ", error);
    throw error;
  }
};

/**
 * currentUserをフォローしているユーザー一覧
 * @param token
 */
export const getFollowerListByCurrentUser = async (token: string) => {
  const path = `/api/user/followerlist/`;
  try {
    const result = await getAxios(path, token);
    return result.data;
  } catch (error) {
    console.log("@getFollowerListByCurrentUser: ", error);
    throw error;
  }
};

/**
 * currentUserがフォローしているユーザー一覧
 * @param token
 */
export const getFollowingListByUserId = async (
  token: string,
  userId: string
) => {
  const path = `/api/user/followinglist/?user_id=${userId}`;
  try {
    const result = await getAxios(path, token);
    return result.data;
  } catch (error) {
    console.log("@getFollowingListByUserId: ", error);
    throw error;
  }
};

/**
 * currentUserをフォローしているユーザー一覧
 * @param token
 */
export const getFollowerListByUserId = async (
  token: string,
  userId: string
) => {
  const path = `/api/user/followerlist/?user_id=${userId}`;
  try {
    const result = await getAxios(path, token);
    return result.data;
  } catch (error) {
    console.log("@getFollowerListByUserId: ", error);
    throw error;
  }
};
