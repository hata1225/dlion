import { VideoCallModal } from "components/VideoCall/VideoCallModal";
import React from "react";
import { UserInterface } from "types/User";

interface VideoCallModalContextInterface {
  isOpenVideoCallModal: boolean;
  setIsOpenVideoCallModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenVideoCallModal: () => void;
  usersByVideoCall: UserInterface[];
  setUsersByVideoCall: React.Dispatch<React.SetStateAction<UserInterface[]>>;
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
  const [usersByVideoCall, setUsersByVideoCall] = React.useState<
    UserInterface[]
  >([]);

  const handleOpenVideoCallModal = () => {
    setIsOpenVideoCallModal(true);
  };

  return (
    <VideoCallModalContext.Provider
      value={{
        isOpenVideoCallModal,
        setIsOpenVideoCallModal,
        handleOpenVideoCallModal,
        usersByVideoCall,
        setUsersByVideoCall,
      }}
    >
      <VideoCallModal
        isOpenVideoCallModal={isOpenVideoCallModal}
        setIsOpenVideoCallModal={setIsOpenVideoCallModal}
        usersByVideoCall={usersByVideoCall}
      />
      {children}
    </VideoCallModalContext.Provider>
  );
};
