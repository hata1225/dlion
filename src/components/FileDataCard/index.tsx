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
  const { user, title, description, created_at, categories, cover_image } =
    fileData;
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
      <img className={classes.img} src={cover_image} alt={title} />
      <div
        ref={bottomAreaRef}
        className={classes.bottomArea}
        style={
          isScaleUpBottomArea
            ? {
                height: `calc(100% - ${baseStyle.bottomAreaButtonAreaSize.height} - 60px)`,
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
              <Link className={classes.tagItem} key={i} href="">
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
    gap: "5px",
  },
  bottomAreaContnetTop: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
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
  tagItem: {
    color: baseStyle.color.gray.main,
    paddingRight: "10px",
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
