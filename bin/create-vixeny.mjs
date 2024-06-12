#!/usr/bin/env node
import inquirer from "inquirer";
import { exec } from "node:child_process";
import fs from "fs";
import path from "path";
import {
  checkPackageManager,
  goodByeMessage,
  listOfImports,
  terminalSpace,
} from "./utils.mjs";
import {
  __dirname,
  __filename,
  questionForMain,
  questionsForBackendTemplate,
  questionsForTemplate,
} from "./config.mjs";
import { copyTemplateFiles, replaceOptionsAndImports } from "./io.mjs";
import { injectPlugins, injectTemplates, toReduceDep } from "./depencies.mjs";

terminalSpace();
console.log(
  "\x1b[31m%s\x1b[0m" + // Red for V
    "\x1b[32m%s\x1b[0m" + // Green for i
    "\x1b[33m%s\x1b[0m" + // Yellow for x
    "\x1b[34m%s\x1b[0m" + // Blue for e
    "\x1b[35m%s\x1b[0m" + // Magenta for n
    "\x1b[36m%s\x1b[0m", // Cyan for y
  "V",
  "i",
  "x",
  "e",
  "n",
  "y",
);
terminalSpace();

const packageManager = await checkPackageManager("npm") ??
  await checkPackageManager("yarn") ??
  await checkPackageManager("pnpm");

inquirer.prompt(questionForMain)
  .then((answers) =>
    answers.main === "with fronted (recommended)" ? fronted() : onlyBackend()
  );
const onlyBackend = async () => {
  inquirer.prompt(questionsForBackendTemplate).then(
    (answers) => {
      // Your previous answers handling here
      let projectName = answers.projectName;
      const currPath = path.basename(process.cwd());
      if (projectName === ".") projectName = currPath;

      let projectPath = "";
      if (projectName != currPath) {
        projectPath = path.join(process.cwd(), projectName);
      } else {
        projectPath = process.cwd();
      }

      // Create project directory if it doesn't exist
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
      }

      // Initialize npm project
      exec(`${packageManager} init -y`, { cwd: projectPath }, (error) => {
        if (error) {
          console.error(`Failed to initialize the project: ${error}`);
          return;
        }

        console.log("Project initialized successfully.");

        const packageJsonPath = path.join(projectPath, "package.json");
        fs.readFile(packageJsonPath, "utf8", (err, data) => {
          if (err) return console.error(`Failed to read package.json: ${err}`);

          const packageJson = JSON.parse(data);
          packageJson.scripts = {
            ...packageJson.scripts,
            start: answers.runtime === "deno"
              ? "deno run -A --unstable-ffi main.ts"
              : "bun run main.ts",
            dev: answers.runtime === "deno"
              ? "deno run -A  --unstable-ffi watcher.mjs --liveReloading "
              : "bun run watcher.mjs",
          };

          if (answers.answers !== "deno") {
            packageJson.dependencies = {
              ...packageJson.dependencies,
              "vixeny": "latest",
            };
            packageJson.devDependencies = {
              ...packageJson.devDependencies,
              "chokidar": "^3.6.0",
              "bun-types": "^1.0.2",
            };

            // injecting dependecies
            packageJson.dependencies = toReduceDep(answers, packageJson.dependencies, injectPlugins);
            packageJson.main = "main.ts";

            fs.writeFile(
              packageJsonPath,
              JSON.stringify(packageJson, null, 2),
              "utf8",
              (err) => {
                if (err) {
                  return console.error(`Failed to write package.json: ${err}`);
                }
              },
            );

            copyTemplateFiles("onlyBackend/" + answers.runtime, projectPath);
            answers?.plugins.forEach(
              (plugin) =>
                copyTemplateFiles("plugins/" + plugin + "/", projectPath),
            );
          }
        });
      });

      goodByeMessage(
        answers.runtime,
        currPath,
        projectName,
      );
    },
  );
};

const fronted = async () => {
  inquirer.prompt(questionsForTemplate).then((answers) => {
    // Your previous answers handling here
    let projectName = answers.projectName;
    const currPath = path.basename(process.cwd());
    if (projectName === ".") projectName = currPath;

    let projectPath = "";
    if (projectName != currPath) {
      projectPath = path.join(process.cwd(), projectName);
    } else {
      projectPath = process.cwd();
    }

    // Create project directory if it doesn't exist
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }

    console.log("Project initialized successfully.");
    // Initialize npm project
    exec(`${packageManager} init -y`, { cwd: projectPath }, (error) => {
      if (error) {
        console.error(`Failed to initialize the project: ${error}`);
        return;
      }

      console.log("Project initialized successfully.");

      const packageJsonPath = path.join(projectPath, "package.json");
      fs.readFile(packageJsonPath, "utf8", (err, data) => {
        if (err) return console.error(`Failed to read package.json: ${err}`);

        let packageJson = JSON.parse(data);
        packageJson.scripts = {
          ...packageJson.scripts,
          start: answers.runtime === "deno"
            ? "deno run -A --unstable-ffi main.ts"
            : "bun run main.ts",
          dev: answers.runtime === "deno"
            ? "deno run -A  --unstable-ffi watcher.mjs --liveReloading "
            : "bun run watcher.mjs",
        };

        packageJson.devDependencies = {
          ...packageJson.dependencies,
          "bun-types": "^1.0.2",
          "chokidar": "^3.6.0",
        };

        if (answers.answers !== "deno") {
          packageJson.dependencies = {
            ...packageJson.dependencies,
            "vixeny": "latest",
            "rehype-format": "^5.0.0",
            "rehype-stringify": "^10.0.0",
            "remark-parse": "^11.0.0",
            "remark-rehype": "^11.1.0",
            "unified": "^11.0.4",
            "vixeny-perspective": "latest",
            "esbuild": "^0.20.1",
          };

          packageJson.dependencies = toReduceDep(answers, packageJson.dependencies, {
            ...injectTemplates,
            ...injectPlugins
          });
        }

        packageJson.main = "main.ts";

    
        fs.writeFile(
          packageJsonPath,
          JSON.stringify(packageJson, null, 2),
          "utf8",
          (err) => {
            if (err) {
              return console.error(`Failed to write package.json: ${err}`);
            }
          },
        );
        //Get the template 
        const listOfTemplates = [
          answers.installationChoice,
          answers.style,
          "typescript",
          "remark",
          ...answers?.template ?? [],
        ]
          .filter((x) => x !== "vanilla");

        copyTemplateFiles(
          "templates/" + answers.installationChoice,
          projectPath,
        );
        copyTemplateFiles("rt/" + answers.runtime, projectPath);
        copyTemplateFiles("css/" + answers.style, projectPath);
        copyTemplateFiles("src/", projectPath);
        listOfTemplates.forEach((template) =>
          copyTemplateFiles("pluginsPerspective/" + template + "/", projectPath)
        );

        answers?.plugins.forEach(
          (plugin) => copyTemplateFiles("plugins/" + plugin + "/", projectPath),
        );

        const importedList = listOfImports(
          listOfTemplates.concat(answers?.plugins ?? []),
        );
        const listForRemplace = listOfTemplates.map((x) => x + "P");

        switch (answers.installationChoice) {
          case "pug":
            replaceOptionsAndImports(
              projectPath,
              importedList +
                'import { pug } from "vixeny-perspective";\n' +
                'import  * as pugModule  from "pug";\n' +
                "const fromPug = pug(pugModule)",
              `
cyclePlugin: {
  ...fromPug,
},`,
              `
const fileServer = {
  type: "fileServer",
  name: "/",
  path: "./views/public/",
  removeExtensionOf: [".html"],
  slashIs: "$main",
  //it has options
  template: [${listForRemplace.toString()}]
};`,
            );
            break;
          case "vanilla":
            replaceOptionsAndImports(
              projectPath,
              importedList,
              "",
              `
const fileServer = {
  type: "fileServer",
  name: "/",
  path: "./views/public/",
  removeExtensionOf: [".html"],
  slashIs: "$main",
  template: [${listForRemplace.toString()}]
};`,
            );
          case "jsx":
            replaceOptionsAndImports(
              projectPath,
              importedList,
              "",
              `
  const fileServer = {
    type: "fileServer",
    name: "/",
    path: "./views/public/",
    removeExtensionOf: [".html"],
    slashIs: "$main",
    template: [${listForRemplace.toString()}]};`,
            );
            break;
          case "tsx":
            replaceOptionsAndImports(
              projectPath,
              importedList,
              "",
              `
  const fileServer = {
    type: "fileServer",
    name: "/",
    path: "./views/public/",
    slashIs: "$main",
    removeExtensionOf: [".html"],
    template: [${listForRemplace.toString()}]
  };`,
            );
            break;
          case "ejs":
            replaceOptionsAndImports(
              projectPath,
              importedList +
                'import { ejs , ejsStaticServerPlugin } from "vixeny-perspective";\n' +
                'import  * as ejsModule  from "ejs";\n' +
                "const fromEjs = ejs(ejsModule)",
              `,
cyclePlugin: {
  ...fromEjs,
},`,
              `
const fileServer = {
  type: "fileServer",
  name: "/",
  path: "./views/public/",
  removeExtensionOf: [".html"],
  slashIs: "$main",
  template: [${listForRemplace.toString()}],
};`,
            );
            break;
        }
        goodByeMessage(
          answers.runtime,
          currPath,
          projectName,
        );
      });
    });
  });
};
