import logger from "@/app/api/utils/log";

export async function findFolder(drive, name, parentId) {
  try {
    const res = await drive.files.list({
      q: `name = '${name}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id)",
      spaces: "drive",
    });
    return { id: res.data.files[0]?.id || null, success: true };
  } catch (err) {
    logger("error", `Error finding folder: ${err.message}`);
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
}

export async function findFile(drive, name, parentId) {
  try {
    const res = await drive.files.list({
      q: `name = '${name}' and '${parentId}' in parents and trashed = false`,
      fields: "files(id)",
      spaces: "drive",
    });
    return { id: res.data.files[0]?.id || null, success: true };
  } catch (err) {
    logger("error", `Error finding file: ${err.message}`);
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
}
