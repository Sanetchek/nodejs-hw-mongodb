import multer from "multer";

import { TEMP_UPLOAD_DIR } from "../constants/index.js";
import createHttpError from "http-errors";

const storage = multer.diskStorage({
  // destination: (req, file, callback) => {
  //   callback(null, TEMP_UPLOAD_DIR);
  // },
  destination: TEMP_UPLOAD_DIR,
  filename: (req, file, callback) => {
    const uniquePreffix = `${Date.now()}_${Math.random() * 1E9}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    callback(null, filename);
  }
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const extention = file.originalname.split(".").pop();

  if (extention === "exe") {
    return createHttpError(400, ".exe not valid extension");
  }

  callback(null, true);
}

const upload = multer({
  storage,
  limits,
  fileFilter
});

export default upload;
