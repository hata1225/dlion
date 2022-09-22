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
import { PostModalLine } from "./PostModalLine";
import { FileData, FileDataStatus } from "types/fileData";
import { patchFileData, postFileData } from "api/api";
import { UserContext } from "contexts/UserContext";
import { FileDataInputArea } from "./FileDataInputArea";
import { FileDataContext } from "contexts/FileDataContexts";
import { createNotification } from "functions/notification";
import { countString } from "functions/countString";

interface Props {
  isOpenPostModal: boolean;
  setIsOpenPostModal: React.Dispatch<React.SetStateAction<boolean>>;
  fileData?: FileData;
}

export const PostModal = (props: Props) => {
  const { isOpenPostModal, setIsOpenPostModal, fileData } = props;
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
  const [isDisabledPostButton, setIsDisabledPostButton] = React.useState(true);
  const [uploadProgressValue, setUploadProgressValue] = React.useState(0);
  const { user } = React.useContext(UserContext);
  const { updateFileData } = React.useContext(FileDataContext);
  const classes = useStyles();

  const mainDataTypeAndStatus: { status: FileDataStatus; matchText: RegExp }[] =
    [
      { status: "video", matchText: /video/ },
      { status: "image", matchText: /image/ },
      { status: "audio", matchText: /audio/ },
      { status: "pdf", matchText: /pdf/ },
    ];

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
      setIsDisabledPostButton(false);
    } else {
      setIsDisabledPostButton(true);
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
  }, [mainData]);

  const handleClose = () => {
    setIsOpenPostModal(false);
  };

  const handleEdit = async () => {
    if (fileData && user?.token) {
      let newFileData = fileData;
      newFileData.title = title;
      newFileData.description = description;
      newFileData.categories = selectedCategories;
      try {
        await patchFileData(newFileData, user.token);
        setIsOpenPostModal(false);
        createNotification("success", "更新できました");
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
              setIsDisabledPostButton(true);
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
      open={isOpenPostModal}
      onClose={handleClose}
    >
      <div className={classes.postArea}>
        <div className={classes.postAreaHeader}>
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
              <PostModalLine />
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
          <PostModalLine />
          <CategoryInputArea
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
          <PostModalLine />
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
            className={classes.postButton}
            variant="contained"
            color="primary"
            onClick={fileData ? handleEdit : handlePost}
            disabled={isDisabledPostButton}
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
  inputDescription: {
    lineHeight: "1.2",
  },
  postButton: {
    width: "100%",
    fontSize: fontSize.medium.small,
  },
});
