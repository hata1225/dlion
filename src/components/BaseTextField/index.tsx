import React from "react";
import { TextField } from "@material-ui/core";

type TextFieldProps = React.ComponentProps<typeof TextField>;
type Props = TextFieldProps & {
  setValue: React.Dispatch<React.SetStateAction<any>>;
};

export const BaseTextField = ({ setValue, ...props }: Props) => {
  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      <TextField
        {...props}
        variant="outlined"
        inputProps={{ style: { fontSize: "1.5rem" } }}
        InputLabelProps={{ style: { fontSize: "1.4rem" } }}
        fullWidth
        onChange={handleChangeValue}
      />
    </>
  );
};
