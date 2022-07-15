import React from "react";
import { UserContext } from "contexts/UserContext";
import { getFileData } from "api/api";

interface FileDataContextInterface {
  fileData: any[];
  setFileData: React.Dispatch<React.SetStateAction<any[]>>;
}

export const FileDataContext = React.createContext<FileDataContextInterface>(
  {} as FileDataContextInterface
);

export const FileDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fileData, setFileData] = React.useState<any[]>([]);
  const { user } = React.useContext(UserContext);

  React.useEffect(() => {
    const f = async () => {
      if (user?.token) {
        const newFileData = await getFileData(user?.token);
        setFileData(newFileData);
      }
    };
    f();
  }, [user]);

  return (
    <FileDataContext.Provider value={{ fileData, setFileData }}>
      {children}
    </FileDataContext.Provider>
  );
};
