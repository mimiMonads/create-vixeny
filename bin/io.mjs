import fs from "node:fs";
import path from "node:path";
import { __dirname, __filename } from "./config.mjs";

export function copyTemplateFiles(templateName, projectPath) {
  const templatePath = path.join(__dirname, "..", templateName);

  function copyRecursively(sourcePath, targetPath) {
    // Check if the source is a directory or file
    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
      // Create the directory if it doesn't exist
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath);
      }

      // Read the directory contents and recursively copy
      const entries = fs.readdirSync(sourcePath);
      for (const entry of entries) {
        const srcPath = path.join(sourcePath, entry);
        const dstPath = path.join(targetPath, entry);
        copyRecursively(srcPath, dstPath);
      }
    } else if (stats.isFile()) {
      // It's a file, copy it
      fs.copyFileSync(sourcePath, targetPath);
    }
  }

  try {
    copyRecursively(templatePath, projectPath);
  } catch (error) {
    console.error("Error copying template files:", error);
  }
}

export function replaceOptionsAndImports(
  projectPath,
  additionalImports,
  additionalOptions,
  additionalStaticServer,
) {
  const filePath = path.join(projectPath, "src/globalOptions.ts"); // Adjust the path format

  // Read the file content
  fs.readFile(
    path.join(__dirname, "..", "var/globalOptions.ts"),
    "utf8",
    (readError, data) => {
      if (readError) {
        console.error(`Error reading file: ${readError}`);
        return;
      }

      const updatedContent = data.replace("///IMPORTS///", additionalImports)
        .replace("///OPTIONS///", additionalOptions)
        .replace("///STATICSERVER///", additionalStaticServer);

      // Write the updated content back to a new file
      fs.writeFileSync(
        filePath,
        updatedContent + "\n export { cryptoKey, globalOptions, fileServer };",
        {
          encoding: "utf8",
        },
        (writeError) => {
          if (writeError) {
            console.error(`Error writing file: ${writeError}`);
            return;
          }
        },
      );
    },
  );
}
