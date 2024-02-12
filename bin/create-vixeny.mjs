#!/usr/bin/env node
import inquirer from "inquirer";
import { exec } from "node:child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
  {
    type: "list",
    name: "installationChoice",
    message: "Welcome to Vixeny!, Which template would you like?",
    choices: ["pug"],
  },
  {
    type: "list",
    name: "runtime",
    message: "Which runtime would you like?",
    choices: ["bun"],
  },
  {
    type: "input",
    name: "projectName",
    message: "What is the name of your project?",
    validate: (input) => {
      // Check if the name is either 'bin' or 'templas'
      if (input === "bin" || input === "templas") {
        return 'Project name cannot be "bin" or "templas". Please choose a different name.';
      }
      // Check if the input is not empty
      if (input.trim().length === 0) {
        return "Project name cannot be empty.";
      }
      return true;
    },
  },
];


inquirer.prompt(questions).then((answers) => {
  // Your previous answers handling here
  const projectName = answers.projectName;

  const isVanilla = answers.installationChoice === "vanilla";
  const projectPath = path.join(process.cwd(), projectName);

  // Create project directory if it doesn't exist
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath);
  }

  // Initialize npm project
  exec(`npm init -y`, { cwd: projectPath }, (error) => {
    if (error) {
      console.error(`Failed to initialize the project: ${error}`);
      return;
    }

    console.log("Project initialized successfully.");

    const packageJsonPath = path.join(projectPath, "package.json");
    fs.readFile(packageJsonPath, "utf8",  (err, data) => {
      if (err) return console.error(`Failed to read package.json: ${err}`);

      const packageJson = JSON.parse(data);
      packageJson.scripts = {
        ...packageJson.scripts,
        start: "bun run main.ts",
        dev: "bun run --liveReloading watcher.mjs",
        test: "bun test /",
      };
      // Set dependencies and devDependencies
      packageJson.dependencies = {
        ...packageJson.dependencies,
        "vixeny": "latest", // Assuming you want the latest version
        "vixeny-perspective": "latest", // Adjust version as necessary
      };
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        "chokidar": "^3.6.0", // Specify your desired version
      };
      packageJson.main = "main.ts";

      fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf8",
        (err) => {
          if (err) return console.error(`Failed to write package.json: ${err}`);
        },
      );
       copyTemplateFiles( 'templates/' + answers.installationChoice, projectPath);
       copyTemplateFiles( 'rt/' + answers.runtime, projectPath);
      console.log("have fun");
    });
  });
});

function copyTemplateFiles(templateName, projectPath) {
  const templatePath = path.join(__dirname, '..' ,templateName);

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
    console.error('Error copying template files:', error);
  }
}