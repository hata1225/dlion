import { FileDataModal } from "components/FileDataModal";
import React from "react";
import { FileData } from "types/fileData";

interface FileDataModalContextInterface {
  isOpenFileDataModal: boolean;
  setIsOpenFileDataModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenPostModal: () => void;
  handleOpenEditModal: (fileDataProps: FileData) => void;
}

export const PostModalContext =
  React.createContext<FileDataModalContextInterface>(
    {} as FileDataModalContextInterface
  );

export const PostModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpenFileDataModal, setIsOpenFileDataModal] = React.useState(false);
  const [fileData, setFileData] = React.useState<FileData>();

  const handleOpenPostModal = () => {
    setIsOpenFileDataModal(true);
  };

  const handleOpenEditModal = (fileDataProp: FileData) => {
    setIsOpenFileDataModal(true);
    setFileData(fileDataProp);
  };

  return (
    <PostModalContext.Provider
      value={{
        isOpenFileDataModal,
        setIsOpenFileDataModal,
        handleOpenPostModal,
        handleOpenEditModal,
      }}
    >
      <FileDataModal
        isOpenFileDataModal={isOpenFileDataModal}
        setIsOpenFileDataModal={setIsOpenFileDataModal}
        fileData={fileData}
      />
      {children}
    </PostModalContext.Provider>
  );
};
