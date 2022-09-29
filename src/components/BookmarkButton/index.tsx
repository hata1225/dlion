import React from "react";
import { FileData } from "types/fileData";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import IconButton from "@material-ui/core/IconButton";
import { baseStyle, fontSize } from "theme";
import { makeStyles } from "@material-ui/core";
import { UserContext } from "contexts/UserContext";

type IconButtonProps = React.ComponentProps<typeof IconButton>;
type Props = IconButtonProps & {
  size?: number;
  fileData?: FileData;
};

export const BookmarkButton = ({ fileData, size, ...props }: Props) => {
  const [isBookmark, setIsBookmark] = React.useState(false);
  const { user } = React.useContext(UserContext);
  const classes = useStyles();

  React.useEffect(() => {
    console.log("user favorites: ", user);
    if (user?.favorites) {
      console.log("user: ", user.favorites);
    }
  }, [user]);

  const handleBookmark = () => {
    setIsBookmark((prev) => !prev);
  };

  return (
    <IconButton
      className={classes.iconButton}
      onClick={handleBookmark}
      {...props}
    >
      {isBookmark ? (
        <BookmarkIcon
          style={{
            fontSize: size ?? fontSize.large.medium,
            color: baseStyle.color.yellow.main,
          }}
        />
      ) : (
        <BookmarkBorderIcon
          style={{
            fontSize: size ?? fontSize.large.medium,
          }}
        />
      )}
    </IconButton>
  );
};

const useStyles = makeStyles({
  iconButton: {
    padding: fontSize.small.small,
    // "&:hover": {
    //   backgroundColor: baseStyle.color.yellow.buttonHover.main,
    // },
  },
});
