import {
  Button,
  IconButton,
  makeStyles,
  Modal,
  LinearProgress,
} from "@material-ui/core";
import React from "react";
import {
  baseStyle,
  borderRadius,
  fileDataTitleMaxLength,
  fontSize,
} from "theme";
import CloseIcon from "@material-ui/icons/Close";
import { BaseTextField } from "components/BaseTextField";
import { CategoryInputArea } from "./CategoryInputArea";
import { FileDataModalLine } from "./FileDataModalLine";
import { FileData, FileDataByEdit, FileDataStatus } from "types/fileData";
import { patchFileData, postFileData } from "api/api";
import { UserContext } from "contexts/UserContext";
import { FileDataInputArea } from "./FileDataInputArea";
import { FileDataContext } from "contexts/FileDataContexts";
import { createNotification } from "functions/notification";
import { countString } from "functions/countString";

interface Props {
  isOpenFileDataModal: boolean;
  setIsOpenFileDataModal: React.Dispatch<React.SetStateAction<boolean>>;
  fileData?: FileData;
  setFileData?: React.Dispatch<React.SetStateAction<FileData | undefined>>;
}

export const FileDataModal = (props: Props) => {
  const { isOpenFileDataModal, setIsOpenFileDataModal, fileData, setFileData } =
    props;
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
  const [isDisabledPostEditButton, setIsDisabledPostEditButton] =
    React.useState(true);
  const [uploadProgressValue, setUploadProgressValue] = React.useState(0);
  const { user } = React.useContext(UserContext);
  const { updateFileData } = React.useContext(FileDataContext);
  const classes = useStyles();

  const mainDataTypeAndStatus: {
    status: FileDataStatus;
    matchText: RegExp;
  }[] = React.useMemo(() => {
    return [
      { status: "video", matchText: /video/ },
      { status: "image", matchText: /image/ },
      { status: "audio", matchText: /audio/ },
      { status: "pdf", matchText: /pdf/ },
    ];
  }, []);

  React.useEffect(() => {
    if (fileData) {
      const { title, description, categories } = fileData;
      setTitle(title);
      setDescription(description);
      console.log("fileData: ", fileData);
      setSelectedCategories(categories);
    }
  }, [fileData]);

  React.useEffect(() => {
    if ((mainData && coverImage && user?.token) || fileData) {
      setIsDisabledPostEditButton(false);
    } else {
      setIsDisabledPostEditButton(true);
    }
  }, [mainData, coverImage, user?.token, fileData]);

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
  }, [mainData, mainDataTypeAndStatus]);

  const handleClose = () => {
    setIsOpenFileDataModal(false);
  };

  const handleEdit = async () => {
    if (fileData && user?.token) {
      const newFileData: FileDataByEdit = {
        id: fileData.id,
        title,
        description,
        categories: selectedCategories,
      };
      if (setFileData) {
        setFileData({ ...fileData, ...newFileData });
      }
      try {
        await patchFileData(newFileData, user.token);
        createNotification("success", "更新できました");
        setIsOpenFileDataModal(false);
      } catch (error: any) {
        createNotification("danger", error?.message, "更新に失敗しました");
      }
    }
  };

  const handlePost = async () => {
    let newData;

    if (coverImage && mainData && user?.token) {
      let data = {
        title,
        description: description ?? "",
        categories: JSON.stringify(selectedCategories),
        cover_image: coverImage,
        main_data_size: String(mainData?.size ?? 0),
        main_data_type: mainDataStatus,
        main_data: mainData,
      };
      if (mainDataStatus === "video") {
        newData = {
          ...{
            video_data_status: JSON.stringify({
              lsm3u8: 0,
              shortmp4: 0,
              allcomplete: 0,
              completetotal: 0,
            }),
          },
          ...data,
        };
      } else {
        newData = {
          ...data,
        };
      }
      try {
        if (newData) {
          await postFileData(
            newData,
            user.token,
            setUploadProgressValue,
            async () => {
              await updateFileData();
              setTitle("");
              setDescription("");
              setSelectedCategories([]);
              setCoverImage(undefined);
              setCoverImageObjectUrl("");
              setMainData(undefined);
              setMainDataObjectUrl("");
              setMainDataStatus("none");
              setIsDisabledPostEditButton(true);
              setUploadProgressValue(0);
              createNotification("success", "投稿できました");
            }
          );
        }
      } catch (error: any) {
        createNotification("danger", error?.message, "投稿に失敗しました");
      }
    }
  };

  return (
    <Modal
      className={classes.modal}
      open={isOpenFileDataModal}
      onClose={handleClose}
    >
      <div className={classes.modalContentArea}>
        <div className={classes.modalContentAreaHeader}>
          <div className={classes.heading}>
            {fileData ? "ファイルを編集する" : "ファイルを投稿する"}
          </div>
          <IconButton className={classes.iconButton} onClick={handleClose}>
            <CloseIcon style={{ fontSize: fontSize.large.small }} />
          </IconButton>
        </div>
        <div className={classes.main}>
          <div className={classes.inputTextArea}>
            <BaseTextField
              label={`タイトル (${countString(
                title
              )}/${fileDataTitleMaxLength})`}
              value={title}
              setValue={setTitle}
              error={countString(title) > fileDataTitleMaxLength}
              helperText={
                countString(title) > fileDataTitleMaxLength
                  ? `${fileDataTitleMaxLength}文字以内で入力してください。`
                  : undefined
              }
            />
            <BaseTextField
              label="説明文"
              value={description}
              setValue={setDescription}
              multiline
              minRows={2}
            />
          </div>
          {!fileData && (
            <>
              <FileDataModalLine />
              <FileDataInputArea
                coverImage={coverImage}
                coverImageObjectUrl={coverImageObjectUrl}
                setCoverImage={setCoverImage}
                setCoverImageObjectUrl={setCoverImageObjectUrl}
                mainData={mainData}
                mainDataObjectUrl={mainDataObjectUrl}
                setMainData={setMainData}
                setMainDataObjectUrl={setMainDataObjectUrl}
                mainDataStatus={mainDataStatus}
              />
            </>
          )}
          <FileDataModalLine />
          <CategoryInputArea
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
          <FileDataModalLine />
          {uploadProgressValue ? (
            <div>
              {`${Math.floor(uploadProgressValue)}%`}
              <LinearProgress
                variant="determinate"
                value={uploadProgressValue}
              />
            </div>
          ) : (
            <></>
          )}
          <Button
            className={classes.postEditButton}
            variant="contained"
            color="primary"
            onClick={fileData ? handleEdit : handlePost}
            disabled={isDisabledPostEditButton}
          >
            {fileData ? "更新する" : "投稿する"}
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
  modalContentArea: {
    height: baseStyle.fileDataModalHeight.pc,
    width: baseStyle.fileDataModalWidth.pc,
    backgroundColor: baseStyle.color.white.light,
    borderRadius: borderRadius.main,
    padding: "10px",
  },
  modalContentAreaHeader: {
    height: baseStyle.modalContentAreaHeader.pc,
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
    height: `calc(100% - ${baseStyle.modalContentAreaHeader.pc})`,
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
  inputDescription: {
    lineHeight: "1.2",
  },
  postEditButton: {
    width: "100%",
    fontSize: fontSize.medium.small,
  },
});
