import { PostModal } from "components/PostModal";
import React from "react";
import { FileData } from "types/fileData";

interface PostModalContextInterface {
  isOpenPostModal: boolean;
  setIsOpenPostModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenPostModal: () => void;
  handleOpenEditModal: (fileDataProps: FileData) => void;
}

export const PostModalContext = React.createContext<PostModalContextInterface>(
  {} as PostModalContextInterface
);

export const PostModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpenPostModal, setIsOpenPostModal] = React.useState(false);
  const [fileData, setFileData] = React.useState<FileData>();

  const handleOpenPostModal = () => {
    setIsOpenPostModal(true);
  };

  const handleOpenEditModal = (fileDataProp: FileData) => {
    setIsOpenPostModal(true);
    setFileData(fileDataProp);
  };

  return (
    <PostModalContext.Provider
      value={{
        isOpenPostModal,
        setIsOpenPostModal,
        handleOpenPostModal,
        handleOpenEditModal,
      }}
    >
      <PostModal
        isOpenPostModal={isOpenPostModal}
        setIsOpenPostModal={setIsOpenPostModal}
        fileData={fileData}
      />
      {children}
    </PostModalContext.Provider>
  );
};
