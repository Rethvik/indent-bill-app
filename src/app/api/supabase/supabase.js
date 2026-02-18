import logger from "../utils/log";
import supabase from "./supabase-client";

const select = async (table, columns, filter) => {
  try {
    let query = supabase.from(table).select(columns);
    if (filter) {
      // Converting filter into supabase supported format
      filter.forEach((item) => {
        query = query[item.operator](item.columnName, item.value);
      });
    }
    const { data, error } = await query;
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, data };
  } catch (err) {
    logger(
      "error",
      `Error in select catch block in supabase file ${err.message}`,
    );
    return { success: false, message: err.message };
  }
};

const insert = async (table, rows) => {
  try {
    let { data, error } = await supabase.from(table).insert(rows).select();
    if (error) {
      return { success: false, message: err.message };
    }
    return { success: true, message: "Data inserted successfully", data };
  } catch (err) {
    logger(
      "error",
      `Error in insert catch block in supabase file ${err.message}`,
    );
  }
};
export { select, insert };
