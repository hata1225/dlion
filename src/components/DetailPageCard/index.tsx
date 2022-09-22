import { Button, makeStyles } from "@material-ui/core";
import { CoverImageAreaByVideoData } from "components/CoverImageAreaByVideoData";
import { DeleteCheckModal } from "components/DeleteCheckModal";
import { DeleteFileDataButton } from "components/DeleteFileDataButton";
import { PostModalContext } from "contexts/PostModalContext";
import React from "react";
import { borderRadius, shadow } from "theme";
import { FileData } from "types/fileData";

interface Props {
  fileData: FileData;
}

export const DetailPageCard = ({ fileData }: Props) => {
  const classes = useStyles();
  const [isOpenDeleteCheckModal, setIsOpenDeleteCheckModal] =
    React.useState(false);
  const { handleOpenPostModal } = React.useContext(PostModalContext);

  const handleClickEditButton = () => {
    handleOpenPostModal(fileData);
  };

  return (
    <>
      <div className={classes.detailPageCard}>
        <div className={classes.leftArea}>
          <CoverImageAreaByVideoData
            className={classes.coverImageAreaByVideoData}
            classNameByImage={classes.image}
            fileData={fileData}
            isNotTransitionPage
          />
        </div>
        <div className={classes.rightArea}>
          <div className={classes.RightTopArea}>
            <h3>{fileData?.title}</h3>
          </div>
          <div className={classes.RightBottomArea}>
            <p>投稿日: {fileData?.created_at}</p>
            <div className={classes.buttonArea}>
              <Button
                onClick={handleClickEditButton}
                variant="outlined"
                color="primary"
              >
                編集
              </Button>
              <DeleteFileDataButton fileData={fileData} />
            </div>
          </div>
        </div>
      </div>
      <DeleteCheckModal
        fileData={fileData}
        isOpenModal={isOpenDeleteCheckModal}
        setIsOpenModal={setIsOpenDeleteCheckModal}
      />
    </>
  );
};

const useStyles = makeStyles({
  detailPageCard: {
    marginTop: "20px",
    width: "100%",
    aspectRatio: "7 / 2",
    boxShadow: shadow.main,
    display: "flex",
    borderRadius: borderRadius.main,
  },
  leftArea: {
    width: "100%",
  },
  coverImageAreaByVideoData: {
    borderRadius: borderRadius.main,
  },
  image: {
    borderRadius: borderRadius.main,
  },
  rightArea: {
    width: "100%",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  RightTopArea: {},
  RightBottomArea: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  buttonArea: {
    display: "flex",
    gap: "10px",
  },
});
