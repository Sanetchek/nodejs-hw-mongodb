import * as fs from "node:fs/promises";

const createDirIfNotExists = async () => {
  try {
    await fs.access(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(path);
    }
  }
};

export default createDirIfNotExists;
