import { VideoCallModal } from "components/VideoCall/VideoCallModal";
import React from "react";

interface VideoCallModalContextInterface {
  isOpenVideoCallModal: boolean;
  handleOpenVideoCallModal: (newUserIdsByVideoCall: string[]) => void;
  handleCloseVideoCallModal: () => void;
  userIdsByVideoCall: string[];
  setUserIdsByVideoCall: React.Dispatch<React.SetStateAction<string[]>>;
}

export const VideoCallModalContext =
  React.createContext<VideoCallModalContextInterface>(
    {} as VideoCallModalContextInterface
  );

export const VideoCallModalModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpenVideoCallModal, setIsOpenVideoCallModal] = React.useState(false);
  const [userIdsByVideoCall, setUserIdsByVideoCall] = React.useState<string[]>(
    []
  );

  const handleOpenVideoCallModal = (newUserIdsByVideoCall: string[]) => {
    setUserIdsByVideoCall(newUserIdsByVideoCall);
    setIsOpenVideoCallModal(true);
  };

  const handleCloseVideoCallModal = () => {
    setUserIdsByVideoCall([]);
    setIsOpenVideoCallModal(false);
  };

  return (
    <VideoCallModalContext.Provider
      value={{
        isOpenVideoCallModal,
        handleOpenVideoCallModal,
        handleCloseVideoCallModal,
        userIdsByVideoCall,
        setUserIdsByVideoCall,
      }}
    >
      <VideoCallModal
        isOpenVideoCallModal={isOpenVideoCallModal}
        setIsOpenVideoCallModal={setIsOpenVideoCallModal}
        userIdsByVideoCall={userIdsByVideoCall}
      />
      {children}
    </VideoCallModalContext.Provider>
  );
};
