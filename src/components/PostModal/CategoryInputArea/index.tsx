import { makeStyles, Button } from "@material-ui/core";
import { BaseSelect } from "components/BaseSelect";
import { BaseTextField } from "components/BaseTextField";
import React from "react";
import { baseStyle, borderRadius } from "theme";
import { PostModalLine } from "../PostModalLine";
import CloseIcon from "@material-ui/icons/Close";
import { UserContext } from "contexts/UserContext";
import { getCategories } from "api/api";

interface Props {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CategoryInputArea = ({
  selectedCategories,
  setSelectedCategories,
}: Props) => {
  const [fetchedCategories, setFetchedCategories] = React.useState<
    { value: string; title: string }[]
  >([]);
  const [addCategory, setAddCategory] = React.useState("");
  const [addNewCategory, setAddNewCategory] = React.useState("");
  const { user } = React.useContext(UserContext);
  const classes = useStyles();

  React.useEffect(() => {
    (async () => {
      if (user?.token) {
        const fetchCategories = await getCategories(user.token);
        if (fetchCategories?.length) {
          const newFetchedCategories = fetchCategories.map((item: any) => ({
            value: `${item.category}`,
            title: `${item.category}`,
          }));
          setFetchedCategories(newFetchedCategories);
        }
      }
    })();
  }, [user]);

  React.useEffect(() => {
    // 重複したcategoryは削除
    if (selectedCategories.length) {
      const typeofSetCategories = new Set(selectedCategories);
      const isDuplicateSelectedCategories =
        typeofSetCategories.size !== selectedCategories.length;
      if (isDuplicateSelectedCategories) {
        const newSelectedCategories = Array.from(new Set(selectedCategories));
        setSelectedCategories(newSelectedCategories);
      }
    }
  }, [selectedCategories]);

  const handleClickAddCategory = (e: any) => {
    let value = e.target?.value;
    if (!value) {
      value = e.target?.innerText;
    }
    if (value) {
      setAddCategory(value);
      setSelectedCategories((prev) => [...prev, value]);
    }
  };

  const handleClickAddNewCategory = () => {
    if (addNewCategory) {
      setSelectedCategories((prev) => [...prev, addNewCategory]);
    }
  };

  const handleClickCategoryClose = (key: number) => {
    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories.splice(key, 1);
    setSelectedCategories(newSelectedCategories);
  };

  return (
    <div className={classes.categoryInputArea}>
      <div className={classes.inputArea}>
        <BaseSelect
          selectLabelTitle="Add category"
          menuItems={fetchedCategories}
          value={addCategory}
          onClick={handleClickAddCategory}
        />
        <PostModalLine />
        <div className={classes.addNewCategoryArea}>
          <BaseTextField
            label="Add new category"
            value={addNewCategory}
            setValue={setAddNewCategory}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickAddNewCategory}
            fullWidth
          >
            新しいカテゴリーを追加する
          </Button>
        </div>
      </div>
      <div className={classes.previewArea}>
        <p className={classes.previewAreaHeading}>Added categories</p>
        <div className={classes.previewAreaInner}>
          {selectedCategories.map((category, key) => (
            <div className={classes.selectedCategory} key={key}>
              <p>{category}</p>
              <CloseIcon
                className={classes.selectedCategoryCloseIcon}
                onClick={() => handleClickCategoryClose(key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  categoryInputArea: {
    height: "164px",
    width: "100%",
    display: "flex",
    gap: "5px",
  },
  inputArea: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "10px",
  },
  addNewCategoryArea: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  previewArea: {
    height: "100%",
    width: "100%",
    border: `solid 1px ${baseStyle.color.gray.main}`,
    borderRadius: borderRadius.main,
    padding: "5px",
  },
  previewAreaHeading: {
    display: "inline",
    backgroundColor: "#fff",
    position: "relative",
    top: "-1.5rem",
    padding: "0 3px",
  },
  previewAreaInner: {
    height: "calc(100% - 1.5rem)",
    display: "flex",
    alignItems: "flex-start",
    alignContent: "flex-start",
    flexWrap: "wrap",
    gap: "5px",
    overflow: "scroll",
  },
  selectedCategory: {
    minHeight: "2.5rem",
    padding: "0 7px",
    border: `solid 1px ${baseStyle.color.gray.main}`,
    borderRadius: "3px",
    maxWidth: "100%",
    boxSizing: "border-box",
    display: "flex",
    gap: "3px",
    alignItems: "center",
  },
  selectedCategoryCloseIcon: {
    cursor: "pointer",
  },
});
