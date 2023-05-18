export const changeCreatedAt = (inputDateString: string) => {
  const inputDate = new Date(inputDateString);

  const createdAtTime = `${inputDate.getHours()}:${inputDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  const createdAtDate = `${inputDate.getMonth() + 1}/${inputDate.getDate()}`;
  const createdAt = `${createdAtDate} ${createdAtTime}`;
  return { createdAtDate, createdAtTime, createdAt };
};
