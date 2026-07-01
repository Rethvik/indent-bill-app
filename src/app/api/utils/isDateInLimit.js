const isDateInLimit = (date1, date2) => {
  const today = new Date();
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  const diff = (d1 - d2) / (1000 * 60 * 60 * 24);
  if (diff === -1) {
    return true;
  } else if (diff === 0) {
    const isPast5PM =
      today.getHours() >= 17 ||
      (today.getHours() === 17 && today.getMinutes() > 0);
    return !isPast5PM;
  } else {
    return false;
  }
};
export default isDateInLimit;
