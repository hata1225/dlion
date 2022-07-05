import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import React from "react";

type FormControlProps = React.ComponentProps<typeof FormControl>;
type Props = FormControlProps & {
  selectLabelTitle: string;
  menuItems: { value: any; title: string }[];
  value?: any;
  setValue?: (value: React.SetStateAction<any>) => void;
  onChange?: (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => void;
};

export const BaseSelect = ({
  selectLabelTitle,
  menuItems,
  value,
  setValue,
  onChange,
  ...props
}: Props) => {
  const handleSelectValue = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value?: unknown;
    }>
  ) => {
    if (setValue) {
      setValue(e.target.value);
    }
  };

  return (
    <FormControl variant="outlined" fullWidth {...props}>
      <InputLabel>{selectLabelTitle}</InputLabel>
      <Select
        label={selectLabelTitle}
        value={value}
        onChange={onChange ?? handleSelectValue}
      >
        {menuItems.map((item, i) => (
          <MenuItem value={item.value} key={i}>
            {item.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
