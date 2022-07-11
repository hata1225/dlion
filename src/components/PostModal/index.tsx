import {
  Button,
  IconButton,
  makeStyles,
  Modal,
  LinearProgress,
} from "@material-ui/core";
import React from "react";
import { baseStyle, borderRadius, fontSize } from "theme";
import CloseIcon from "@material-ui/icons/Close";
import { BaseTextField } from "components/BaseTextField";
import { CategoryInputArea } from "./CategoryInputArea";
import { PostModalLine } from "./PostModalLine";
import { FileDataStatus } from "types/fileDataStatus";
import { postFileData } from "api/api";
import { UserContext } from "contexts/UserContext";
import { FileDataInputArea } from "./FileDataInputArea";

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
  const [isDisabledPostButton, setIsDisabledPostButton] = React.useState(true);
  const [uploadProgressValue, setUploadProgressValue] = React.useState(0);
  const { user } = React.useContext(UserContext);
  const classes = useStyles();

  const mainDataTypeAndStatus: { status: FileDataStatus; matchText: RegExp }[] =
    [
      { status: "video", matchText: /video/ },
      { status: "image", matchText: /image/ },
      { status: "audio", matchText: /audio/ },
      { status: "pdf", matchText: /pdf/ },
    ];

  React.useEffect(() => {
    if (mainData && coverImage && user?.token) {
      setIsDisabledPostButton(false);
    } else {
      setIsDisabledPostButton(true);
    }
  }, [mainData, coverImage, user?.token]);

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
    if (coverImage && mainData && user?.token) {
      let data = {
        title,
        description,
        categories: JSON.stringify(selectedCategories),
        cover_image: coverImage,
        main_data_size: String(mainData?.size ?? 0),
        main_data_type: mainDataStatus,
      };
      if (mainDataStatus === "video") {
        const newData = {
          ...{
            video_data: mainData,
            video_data_status: JSON.stringify({
              hm3u8: 0,
              lowmp4: 0,
              lm3u8: 0,
              playlist: 0,
              allcomplete: 0,
              completetotal: 0,
            }),
          },
          ...data,
        };
        await postFileData(
          newData,
          user.token,
          setUploadProgressValue,
          async () => {
            setTitle("");
            setDescription("");
            setCoverImage(undefined);
            setCoverImageObjectUrl("");
            setMainData(undefined);
            setMainDataObjectUrl("");
            setMainDataStatus("none");
            setIsDisabledPostButton(true);
            setUploadProgressValue(0);
          }
        );
      } else if (mainDataStatus === "image") {
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
              minRows={2}
            />
          </div>
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
            onClick={handlePost}
            disabled={isDisabledPostButton}
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
  inputDescription: {
    lineHeight: "1.2",
  },
  postButton: {
    width: "100%",
    fontSize: fontSize.medium.small,
  },
});
