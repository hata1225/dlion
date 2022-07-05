import { Button, IconButton, makeStyles, Modal } from "@material-ui/core";
import React from "react";
import { baseStyle, borderRadius, fontSize } from "theme";
import CloseIcon from "@material-ui/icons/Close";
import { CoverImageInputArea } from "./CoverImageInputArea";
import { MainDataInputArea } from "./MainDataInputArea";
import { BaseTextField } from "components/BaseTextField";
import { CategoryInputArea } from "./CategoryInputArea";
import { PostModalLine } from "./PostModalLine";
import { FileDataStatus } from "types/fileDataStatus";

interface Props {
  isOpenPostModal: boolean;
  setIsOpenPostModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PostModal = (props: Props) => {
  const { isOpenPostModal, setIsOpenPostModal } = props;
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const [coverImage, setCoverImage] = React.useState<File>();
  const [coverImageObjectUrl, setCoverImageObjectUrl] = React.useState("");
  const [mainData, setMainData] = React.useState<File>();
  const [mainDataObjectUrl, setMainDataObjectUrl] = React.useState("");
  const [mainDataStatus, setMainDataStatus] =
    React.useState<FileDataStatus>("none");
  const classes = useStyles();

  const mainDataTypeAndStatus: { status: FileDataStatus; matchText: RegExp }[] =
    [
      { status: "video", matchText: /video/ },
      { status: "image", matchText: /image/ },
      { status: "audio", matchText: /audio/ },
      { status: "pdf", matchText: /pdf/ },
    ];

  React.useEffect(() => {
    if (mainData) {
      const mainDataType = mainData?.type;
      mainDataTypeAndStatus.forEach((item, i) => {
        if (mainDataType.match(item.matchText)) {
          const newMainDataTypeAndStatus = mainDataTypeAndStatus[i].status;
          setMainDataStatus(newMainDataTypeAndStatus);
        }
      });
    }
  }, [mainData]);

  const handleClose = () => {
    setIsOpenPostModal(false);
  };

  const handlePost = async () => {
    console.log("handlePost");
    console.log("subfileData: ", coverImage);
    console.log("subfileData: ", coverImage?.type);
  };

  const handleChangeFileData = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileData: (value: React.SetStateAction<File | undefined>) => void,
    setFileDataObjectUrl: (value: React.SetStateAction<string>) => void
  ) => {
    if (e.target.files?.length) {
      const fileData = e.target.files[0];
      setFileData(fileData);
      console.log("fileDataType: ", fileData.type);
      const newFileDataObjectUrl = URL.createObjectURL(fileData);
      setFileDataObjectUrl(newFileDataObjectUrl);
    }
  };

  return (
    <Modal
      className={classes.modal}
      open={isOpenPostModal}
      onClose={handleClose}
    >
      <div className={classes.postArea}>
        <div className={classes.postAreaHeader}>
          <div className={classes.heading}>ファイルを投稿する</div>
          <IconButton className={classes.iconButton} onClick={handleClose}>
            <CloseIcon style={{ fontSize: fontSize.large.small }} />
          </IconButton>
        </div>
        <div className={classes.main}>
          <div className={classes.inputTextArea}>
            <BaseTextField label="タイトル" value={title} setValue={setTitle} />
            <BaseTextField
              label="説明文"
              value={description}
              setValue={setDescription}
              multiline
              rows={2}
            />
          </div>
          <PostModalLine />
          <div>
            <div className={classes.inputArea}>
              <CoverImageInputArea
                coverImage={coverImage}
                coverImageObjectUrl={coverImageObjectUrl}
                handleChangeCoverImage={(e) =>
                  handleChangeFileData(e, setCoverImage, setCoverImageObjectUrl)
                }
              />
              <MainDataInputArea
                mainData={mainData}
                mainDataObjectUrl={mainDataObjectUrl}
                handleChangeMainData={(e) =>
                  handleChangeFileData(e, setMainData, setMainDataObjectUrl)
                }
                mainDataStatus={mainDataStatus}
              />
            </div>
          </div>
          <PostModalLine />
          <CategoryInputArea
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
          <PostModalLine />
          <Button
            className={classes.postButton}
            variant="contained"
            color="primary"
            onClick={handlePost}
          >
            投稿する
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const useStyles = makeStyles({
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  postArea: {
    height: baseStyle.postModalHeight.pc,
    width: baseStyle.postModalWidth.pc,
    backgroundColor: baseStyle.color.white.light,
    borderRadius: borderRadius.main,
    padding: "10px",
  },
  postAreaHeader: {
    height: baseStyle.postAreaHeader.pc,
    display: "flex",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: fontSize.large.medium,
    fontWeight: "bold",
  },
  iconButton: {
    padding: "6px",
  },
  main: {
    height: `calc(100% - ${baseStyle.postAreaHeader.pc})`,
    paddingTop: "10px",
    overflow: "scroll",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputTextArea: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  inputArea: {
    width: "100%",
    display: "flex",
    gap: "5px",
  },
  postButton: {
    width: "100%",
    fontSize: fontSize.medium.small,
  },
});
