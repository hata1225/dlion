import { Card, Link, makeStyles } from "@material-ui/core";
import React from "react";
import { FileData } from "types/fileData";
import {
  baseAnimationTransitoin,
  baseStyle,
  borderRadius,
  fontSize,
} from "theme";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { CoverImageAreaByVideoData } from "components/CoverImageAreaByVideoData";
import { BookmarkButton } from "components/BookmarkButton";
import userIconImageDefault from "userIconImageDefault.webp";

type CardProps = React.ComponentProps<typeof Card>;
type Props = CardProps & {
  className: string;
  fileData: FileData;
};

export const FileDataCard = ({
  className,
  fileData,
  style,
  ...props
}: Props) => {
  const { title, description, categories, user } = fileData;
  const [isScaleUpBottomArea, setIsScaleUpButtonArea] = React.useState(false);
  const [bottomAreaDefaultHeight, setBottomAreaDefaultHeight] =
    React.useState(0);
  const classes = useStyles();
  const bottomAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isScaleUpBottomArea && bottomAreaRef.current) {
      const bottomAreaHeightByRef = bottomAreaRef.current?.clientHeight;
      if (bottomAreaDefaultHeight === 0) {
        setBottomAreaDefaultHeight(bottomAreaHeightByRef);
      }
    }
  }, [bottomAreaRef.current?.clientHeight]);

  const handleClickButton = () => {
    setIsScaleUpButtonArea((prev) => !prev);
  };

  return (
    <Card
      className={`${classes.fileDataCard} ${className}`}
      {...props}
      style={{
        paddingBottom: `${bottomAreaDefaultHeight}px`,
        ...style,
      }}
    >
      <div className={classes.userInfoArea}>
        <div>
          <img
            className={classes.userIconImage}
            src={user?.icon_image ?? userIconImageDefault}
            alt=""
          />
        </div>
        <div>
          <p>{user?.name}</p>
        </div>
      </div>
      <CoverImageAreaByVideoData fileData={fileData} />
      <div
        ref={bottomAreaRef}
        className={classes.bottomArea}
        style={
          isScaleUpBottomArea
            ? {
                height: `calc(100% - ${baseStyle.bottomAreaButtonAreaSize.height} - 55px)`,
              }
            : {
                height:
                  bottomAreaDefaultHeight > 0
                    ? `${bottomAreaDefaultHeight}px`
                    : "auto",
              }
        }
      >
        <div className={classes.bottomAreaContnet}>
          <div className={classes.bottomAreaContnetTop}>
            <div className={classes.bottomAreaContentTopLeft}>
              <h3
                className={classes.heading}
                style={
                  isScaleUpBottomArea
                    ? {
                        WebkitLineClamp: 2,
                        height: "auto",
                      }
                    : {}
                }
              >
                {title}
              </h3>
              <p
                className={classes.description}
                style={
                  isScaleUpBottomArea
                    ? {
                        WebkitLineClamp: 7,
                        height: "auto",
                      }
                    : {}
                }
              >
                {description}
              </p>
            </div>
            <div className={classes.bottomAreaContentTopRight}>
              <BookmarkButton />
            </div>
          </div>
          <p
            className={classes.categoriesArea}
            style={
              isScaleUpBottomArea
                ? {
                    WebkitLineClamp: 2,
                    height: "auto",
                  }
                : {}
            }
          >
            {categories.map((item, i) => (
              <Link className={classes.category} key={i} href="">
                #{item}
              </Link>
            ))}
          </p>
        </div>

        <div className={classes.button} onClick={handleClickButton}>
          <ExpandLessIcon
            className={classes.buttonIcon}
            style={isScaleUpBottomArea ? { transform: "rotate(180deg)" } : {}}
          />
        </div>
      </div>
    </Card>
  );
};

const useStyles = makeStyles({
  fileDataCard: {
    fontSize: 0, // imgとbottomAreaの間の隙間をなくす
    position: "relative",
    height: "100%",
  },
  userInfoArea: {
    display: "flex",
    alignItems: "center",
    padding: "5px 7px 5px 7px",
    gap: "5px",
  },
  userIconImage: {
    width: baseStyle.userIconSize.small,
    height: baseStyle.userIconSize.small,
    borderRadius: "50%",
    objectFit: "cover",
  },
  img: {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    zIndex: 1,
  },
  bottomArea: {
    width: "100%",
    padding: "7px",
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: `${borderRadius.main} ${borderRadius.main} 0 0`,
    transition: baseAnimationTransitoin.main,
  },
  bottomAreaContnet: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  bottomAreaContnetTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
  },
  bottomAreaContentTopLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  bottomAreaContentTopRight: {},
  heading: {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
  },
  description: {
    height: "2.8rem",
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  categoriesArea: {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    minHeight: "1.5rem",
  },
  category: {
    color: baseStyle.color.gray.main,
    paddingRight: "10px",
    display: "inline-block",
  },
  button: {
    cursor: "pointer",
    backgroundColor: "#fff",
    width: baseStyle.bottomAreaButtonAreaSize.width,
    height: baseStyle.bottomAreaButtonAreaSize.height,
    zIndex: 100,
    position: "absolute",
    top: `-${baseStyle.bottomAreaButtonAreaSize.height}`,
    borderRadius: `${borderRadius.main} ${borderRadius.main} 0 0`,
    display: "flex",
    justifyContent: "center",
  },
  buttonIcon: {
    fontSize: fontSize.large.large,
    transition: baseAnimationTransitoin.main,
  },
});
