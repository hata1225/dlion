import { PostModal } from "components/PostModal";
import React from "react";

interface PostModalContextInterface {
  isOpenPostModal: boolean;
  setIsOpenPostModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenPostModal: () => void;
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

  const handleOpenPostModal = () => {
    setIsOpenPostModal(true);
  };

  return (
    <PostModalContext.Provider
      value={{ isOpenPostModal, setIsOpenPostModal, handleOpenPostModal }}
    >
      <PostModal
        isOpenPostModal={isOpenPostModal}
        setIsOpenPostModal={setIsOpenPostModal}
      />
      {children}
    </PostModalContext.Provider>
  );
};
