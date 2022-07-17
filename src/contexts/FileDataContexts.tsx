import React from "react";
import { UserContext } from "contexts/UserContext";
import { getFileData } from "api/api";
import { FileData } from "types/fileData";

interface FileDataContextInterface {
  fileData: FileData[];
  setFileData: React.Dispatch<React.SetStateAction<FileData[]>>;
  updateFileData: () => Promise<void>;
}

export const FileDataContext = React.createContext<FileDataContextInterface>(
  {} as FileDataContextInterface
);

export const FileDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fileData, setFileData] = React.useState<FileData[]>([]);
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    const f = async () => {
      if (user?.token) {
        const newFileData = await getFileData(user?.token);
        newFileData.forEach((item: any) => {
          item.categories = JSON.parse(item.categories);
        });
        setFileData(newFileData);
      }
    };
    f();
  }, [user]);

  const updateFileData = async () => {
    if (user?.token) {
      const newFileData = await getFileData(user?.token);
      setFileData(newFileData);
    } else {
      console.log("@updateFileData: User token is not found. ");
    }
  };

  return (
    <FileDataContext.Provider value={{ fileData, setFileData, updateFileData }}>
      {children}
    </FileDataContext.Provider>
  );
};
