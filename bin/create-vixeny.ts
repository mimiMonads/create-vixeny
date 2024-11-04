import inquirer from "inquirer";
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { runtime } from "vixeny";
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
  template,
} from "./config.mjs";
import { copyTemplateFiles, replaceOptionsAndImports } from "./io.mjs";
import { injectPlugins, injectTemplates, toReduceDep } from "./depencies.mjs";

// Checks if you are running deno or bun

const currentRuntime = runtime.name();

if (!(currentRuntime === "Deno") && !(currentRuntime === "Bun")) {
  throw new Error(currentRuntime + " is not supported.");
}

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

const packageManager = currentRuntime === "Bun"
  ? "bun"
  // @ts-ignore
  : Deno.execPath();

const flags = runtime.arguments();

const onlyBackend = async () => {
  inquirer.prompt(questionsForBackendTemplate).then((answers) => {
    // Your previous answers handling here
    if (!packageManager) {
      console.error("Can't find Bun or Deno package manager.");
      return;
    }

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
    exec(`${packageManager} init`, { cwd: projectPath }, (error) => {
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
          start: currentRuntime === "Deno"
            ? "deno run -A --unstable-ffi main.ts"
            : "bun run main.ts",
          dev: currentRuntime === "Deno"
            ? "deno run -A  --unstable-ffi watcher.mjs --liveReloading "
            : "bun run watcher.mjs",
        };

        if (answers.answers !== "Deno") {
          packageJson.dependencies = {
            ...packageJson.dependencies,
            vixeny: "0.1.49",
          };
          packageJson.devDependencies = {
            ...packageJson.devDependencies,
            chokidar: "^3.6.0",
            "bun-types": "^1.0.2",
          };

          // injecting dependecies
          packageJson.dependencies = toReduceDep(
            answers,
            packageJson.dependencies,
            injectPlugins,
          );
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
        }

        copyTemplateFiles("onlyBackend/" + currentRuntime, projectPath);
        answers?.plugins.forEach((plugin) =>
          copyTemplateFiles("plugins/" + plugin + "/", projectPath)
        );
      });
    });

    goodByeMessage(currentRuntime, currPath, projectName);
  });
};

const fronted = async (ob?: Promise<any>) => {
  (ob ?? inquirer.prompt(questionsForTemplate)).then((answers) => {
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
    exec(`${packageManager} init`, {
      cwd: projectPath,
      //@ts-ignore // not recommended but uwu
      uid: process.getuid(),
      //@ts-ignore
      gid: process.getgid(),
    }, (error) => {
      if (error) {
        console.error(`Failed to initialize the project: ${error}`);
        return;
      }

      if (currentRuntime !== "Deno") {
        const packageJsonPath = path.join(projectPath, "package.json");
        fs.readFile(packageJsonPath, "utf8", (err, data) => {
          if (err) return console.error(`Failed to read package.json: ${err}`);

          let packageJson = JSON.parse(data);
          packageJson.scripts = {
            ...packageJson.scripts,
            start:
              // "deno run -A --unstable-ffi main.ts"
              "bun run main.ts",
            dev:
              // "deno run -A  --unstable-ffi watcher.mjs --liveReloading "
              "bun run watcher.mjs",
          };

          packageJson.devDependencies = {
            ...packageJson.dependencies,
            "bun-types": "^1.0.2",
          };

          if (answers.answers !== "Deno") {
            packageJson.dependencies = {
              ...packageJson.dependencies,
              vixeny: "^0.1.49",
              "vixeny-perspective": "^0.1.44",
              esbuild: "^0.20.1",
            };

            packageJson.dependencies = toReduceDep(
              answers,
              packageJson.dependencies,
              {
                ...injectTemplates,
                ...injectPlugins,
              },
            );
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
        });
      }
      //Get the template
      const listOfTemplates = [
        answers.installationChoice,
        answers.style,
        "typescript",
        ...(answers?.template ?? []),
      ].filter((x) => x !== "vanilla");

      copyTemplateFiles(
        "templates/" + answers.installationChoice,
        projectPath,
      );
      copyTemplateFiles("rt/" + currentRuntime, projectPath);
      copyTemplateFiles("css/" + answers.style, projectPath);
      copyTemplateFiles("src/", projectPath);
      listOfTemplates.forEach((template) =>
        copyTemplateFiles("pluginsPerspective/" + template + "/", projectPath)
      );

      answers?.plugins.forEach((plugin) =>
        copyTemplateFiles("plugins/" + plugin + "/", projectPath)
      );

      const importedList = listOfImports(
        listOfTemplates.concat(answers?.plugins ?? []),
      );
      const listForRemplace = listOfTemplates.map((x) => x + "P");

      replaceOptionsAndImports(
        projectPath,
        importedList,
        //adding plugins
        answers?.plugins && answers.plugins.length > 0
          ? `cyclePlugin: { ${
            answers.plugins.map(
              (x) => "..." + x + "P, ",
            )
          }},`
          : "",
        `
const fileServer = plugins.fileServer({
  type: "fileServer",
  name: "/",
  path: "/views/public/",
  removeExtensionOf: [".html"],
  slashIs: "$main",
  mime: true,
  template: [${listForRemplace.toString()}]
});`,
      );

      goodByeMessage(currentRuntime, currPath, projectName);
    });
  });
};

if (!("test" in flags) && !(flags.test)) {
  inquirer
    .prompt(questionForMain)
    .then((answers) =>
      answers.main === "with fronted" ? fronted() : onlyBackend()
    );
} else {
  // Testing purpose

  if ("frontend" in flags) {
    const templates = template.map((x) => x.value);

    await fronted(
      new Promise(
        (res) =>
          res({
            template: templates,
            projectName: "dest",
            installationChoice: "tsx",
            style: "vanilla",
          }),
      ),
    );
  }
}