function convertDateToSheet(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  const monthName = date.toLocaleString("en-US", { month: "long" });
  const dayString = String(date.getDate()).padStart(2, "0");

  return `${monthName}${dayString}${date.getFullYear()}`;
}

export default convertDateToSheet;
