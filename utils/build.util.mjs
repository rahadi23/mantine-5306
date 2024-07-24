import fs from "fs";
import path from "path";

export const getFiles = (entry, extensions = [], excludeExtensions = []) => {
  const fileNames = [];

  const dirs = fs.readdirSync(entry);

  dirs.forEach((dir) => {
    const currTarget = path.join(entry, dir);

    if (fs.lstatSync(currTarget).isDirectory()) {
      fileNames.push(...getFiles(currTarget, extensions, excludeExtensions));
      return;
    }

    if (
      !excludeExtensions.some((exclude) => dir.endsWith(exclude)) &&
      extensions.some((ext) => dir.endsWith(ext))
    ) {
      fileNames.push(currTarget);
    }
  });

  return fileNames;
};

export const getEmptyDirs = (target) => {
  const emptyDirs = [];

  const dirs = fs.readdirSync(target);

  dirs.forEach((dir) => {
    const currTarget = path.join(target, dir);

    if (fs.lstatSync(currTarget).isDirectory()) {
      if (!fs.readdirSync(currTarget).length) {
        emptyDirs.push(currTarget);
        return;
      }

      emptyDirs.push(...getEmptyDirs(currTarget));
    }
  });

  return emptyDirs;
};

export const delEmptyDirs = (options) => ({
  name: "empty-dirs",

  writeBundle: () => {
    const { path, verbose = false } = options;

    let emptyDirs = getEmptyDirs(path);

    while (emptyDirs.length) {
      for (const emptyDir of emptyDirs) {
        try {
          fs.rmdirSync(emptyDir);

          if (verbose) {
            console.log(`Removed empty directory ${emptyDir}`);
          }
        } catch (err) {
          if (err && err.code === "ENOENT") {
            console.warn(`Directory ${emptyDir} not found, skipping.`);
            continue;
          }

          if (err && err.code === "ENOTDIR") {
            console.warn(`${emptyDir} is not a directory, skipping.`);
            continue;
          }

          throw err;
        }
      }

      emptyDirs = getEmptyDirs(path);
    }
  },
});
