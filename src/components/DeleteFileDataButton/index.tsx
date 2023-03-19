import React from "react";
import { RedButton } from "components/RedButton";
import { DeleteCheckModal } from "components/DeleteCheckModal";
import { Button } from "@material-ui/core";
import { FileData } from "types/fileData";

type DeleteFileDataButtonProps = React.ComponentProps<typeof Button>;
type Props = DeleteFileDataButtonProps & {
  fileData: FileData;
};

export const DeleteFileDataButton = ({
  fileData,
  onClick,
  variant,
  color,
  ...props
}: Props) => {
  const [isOpenDeleteCheckModal, setIsOpenDeleteCheckModal] =
    React.useState(false);

  const handleClickDeleteButton = () => {
    if (fileData) {
      console.log("fileData: ", fileData);
      setIsOpenDeleteCheckModal(true);
    }
  };

  return (
    <>
      <RedButton
        onClick={onClick ?? handleClickDeleteButton}
        variant={variant ?? "outlined"}
        color={color ?? "secondary"}
        {...props}
      >
        削除
      </RedButton>
      <DeleteCheckModal
        fileData={fileData}
        isOpenModal={isOpenDeleteCheckModal}
        setIsOpenModal={setIsOpenDeleteCheckModal}
      />
    </>
  );
};
