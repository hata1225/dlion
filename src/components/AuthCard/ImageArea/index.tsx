import { makeStyles } from "@material-ui/core";
import { UserContext } from "contexts/UserContext";
import React from "react";
import { baseStyle, borderRadius, fontSize } from "theme";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

type Props = {
  setUserBackgroundImage: React.Dispatch<
    React.SetStateAction<File | undefined>
  >;
  setUserBackgroundImageUrl: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  userBackgroundImageUrl?: string;
  setUserIconImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  setUserIconImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  userIconImageUrl?: string;
};

export const ImageArea = ({
  setUserBackgroundImage,
  setUserBackgroundImageUrl,
  userBackgroundImageUrl,
  setUserIconImage,
  setUserIconImageUrl,
  userIconImageUrl,
}: Props) => {
  const classes = useStyles();
  const [isHoverUserBackgroundImage, setIsHoverUserBackgroundImage] =
    React.useState(false);
  const [isHoverUserIconImage, setIsHoverUserIconImage] = React.useState(false);
  const { user } = React.useContext(UserContext);
  const userBackgroundImageRef = React.useRef<HTMLInputElement>(null);
  const userIconImageRef = React.useRef<HTMLInputElement>(null);

  const handleClickByObjectArea = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handleChangeFileData = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileData: (value: React.SetStateAction<File | undefined>) => void,
    setFileDataObjectUrl: (
      value: React.SetStateAction<string | undefined>
    ) => void
  ) => {
    if (e.target.files?.length) {
      const fileData = e.target.files[0];
      setFileData(fileData);
      const newFileDataObjectUrl = URL.createObjectURL(fileData);
      console.log(newFileDataObjectUrl);
      setFileDataObjectUrl(newFileDataObjectUrl);
      e.target.value = "";
    }
  };

  return (
    <>
      <div className={classes.imageArea}>
        <div
          className={classes.userBackgroundImageArea}
          onClick={() => handleClickByObjectArea(userBackgroundImageRef)}
          onMouseEnter={() => setIsHoverUserBackgroundImage(true)}
          onMouseLeave={() => setIsHoverUserBackgroundImage(false)}
        >
          <input
            ref={userBackgroundImageRef}
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleChangeFileData(
                e,
                setUserBackgroundImage,
                setUserBackgroundImageUrl
              )
            }
          />
          {userBackgroundImageUrl && (
            <img
              className={classes.userBackgroundImage}
              src={userBackgroundImageUrl}
              alt={user?.name ?? ""}
            />
          )}
          {isHoverUserBackgroundImage && (
            <div
              className={classes.changeView}
              style={{ borderRadius: borderRadius.main }}
            >
              <AddAPhotoIcon style={{ fontSize: fontSize.large.large }} />
            </div>
          )}
        </div>
        <div
          className={classes.userIconImageArea}
          onClick={() => handleClickByObjectArea(userIconImageRef)}
          onMouseEnter={() => setIsHoverUserIconImage(true)}
          onMouseLeave={() => setIsHoverUserIconImage(false)}
        >
          <input
            ref={userIconImageRef}
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleChangeFileData(e, setUserIconImage, setUserIconImageUrl)
            }
          />
          <img
            className={classes.userIconImage}
            src={userIconImageUrl}
            alt={user?.name}
          />
          {isHoverUserIconImage && (
            <div className={classes.changeView} style={{ borderRadius: "50%" }}>
              <AddAPhotoIcon style={{ fontSize: fontSize.large.large }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles({
  imageArea: {
    position: "relative",
    marginBottom: `calc(${baseStyle.userIconSize.main} / 3)`,
  },
  changeView: {
    height: "100%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: baseStyle.color.white.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userBackgroundImageArea: {
    width: "100%",
    aspectRatio: "16 / 6",
    backgroundColor: baseStyle.color.gray.light,
    borderRadius: borderRadius.main,
    cursor: "pointer",
  },
  userBackgroundImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    verticalAlign: "top",
    borderRadius: borderRadius.main,
  },
  userIconImageArea: {
    width: baseStyle.userIconSize.main,
    height: baseStyle.userIconSize.main,
    borderRadius: "50%",
    backgroundColor: baseStyle.color.gray.main,
    bottom: `calc(-${baseStyle.userIconSize.main} / 3)`,
    position: "absolute",
    marginLeft: "10px",
    cursor: "pointer",
    zIndex: 10,
  },
  userIconImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  },
});
