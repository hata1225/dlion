import React from "react";
import { UserContext } from "contexts/UserContext";
import { getAllFileData, getFileDataByUserId } from "api/api";
import { FileData } from "types/fileData";

interface FileDataContextInterface {
  mineFileData: FileData[];
  setMineFileData: React.Dispatch<React.SetStateAction<FileData[]>>;
  allFileData: FileData[];
  setAllFileData: React.Dispatch<React.SetStateAction<FileData[]>>;
  updateFileData: () => Promise<void>;
  fileDataByUserId: (userId: string) => any;
}

export const FileDataContext = React.createContext<FileDataContextInterface>(
  {} as FileDataContextInterface
);

export const FileDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mineFileData, setMineFileData] = React.useState<FileData[]>([]);
  const [allFileData, setAllFileData] = React.useState<FileData[]>([]);
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    const f = async () => {
      if (user?.token) {
        const newAllFileData = await getAllFileData(user?.token);
        setAllFileData(newAllFileData);
        const newMineFileData = await getFileDataByUserId(user?.token, user.id);
        setMineFileData(newMineFileData);
      }
    };
    f();
  }, [user]);

  const updateFileData = async () => {
    if (user?.token) {
      const newAllFileData = await getAllFileData(user?.token);
      setAllFileData(newAllFileData);
    } else {
      console.log("@updateFileData: User token is not found. ");
    }
  };

  const fileDataByUserId = async (userId: string) => {
    let newFileDataByUserId = [];
    if (userId && user?.token) {
      newFileDataByUserId = await getFileDataByUserId(user?.token, userId);
    }
    return newFileDataByUserId;
  };

  return (
    <FileDataContext.Provider
      value={{
        mineFileData,
        setMineFileData,
        allFileData,
        setAllFileData,
        updateFileData,
        fileDataByUserId,
      }}
    >
      {children}
    </FileDataContext.Provider>
  );
};
