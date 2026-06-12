const convertDateToFileFormat = (date) => {
  const [year, month] = date.split("-");

  const monthName = new Date(date).toLocaleString("en-US", { month: "long" });
  return { year, month, monthName };
};
export default convertDateToFileFormat;
