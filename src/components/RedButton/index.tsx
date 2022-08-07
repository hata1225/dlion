import { Button, makeStyles } from "@material-ui/core";
import React from "react";
import { baseStyle } from "theme";

type ButtonProps = React.ComponentProps<typeof Button>;

export const RedButton = ({
  variant,
  className,
  children,
  ...props
}: ButtonProps) => {
  const classes = useStyles();

  return (
    <Button
      className={`${
        variant === "outlined"
          ? classes.buttonOutlined
          : classes.buttonContained
      } ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

const useStyles = makeStyles({
  buttonContained: {
    backgroundColor: baseStyle.color.red.main,
    color: baseStyle.color.white.light,
    "&:hover": {
      backgroundColor: baseStyle.color.red.mainButtonHover,
    },
  },
  buttonOutlined: {
    color: baseStyle.color.red.main,
    border: `solid 1px ${baseStyle.color.red.main}`,
  },
});
