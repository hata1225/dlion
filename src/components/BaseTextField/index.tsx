import React from "react";
import { makeStyles, TextField } from "@material-ui/core";

type TextFieldProps = React.ComponentProps<typeof TextField>;
type Props = TextFieldProps;

export const BaseTextField = (props: Props) => {
  const classes = useStyles();
  return (
    <>
      <TextField
        className={classes.textField}
        {...props}
        inputProps={{ style: { fontSize: "1.5rem" } }}
        InputLabelProps={{ style: { fontSize: "1.4rem" } }}
        fullWidth
      />
    </>
  );
};

const useStyles = makeStyles({
  textField: {
    margin: "10px 0",
  },
});
