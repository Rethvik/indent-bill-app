const convertToRecord = (rows) => {
  try {
    const headers = rows[0];
    const records = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] !== undefined ? row[i] : "";
      });
      return obj;
    });
    return { headers, records, success: true };
  } catch (error) {
    console.error("Error converting rows to records:", error.message);
    return { headers: [], records: [], success: false, message: error.message };
  }
};

export { convertToRecord };
