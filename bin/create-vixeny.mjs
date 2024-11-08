import inquirer from "inquirer";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { goodByeMessage, listOfImports, terminalSpace } from "./utils.mjs";
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

const argumentsUsed = () =>
  //@ts-ignore
  (typeof Deno !== "undefined" ? Deno.args : process.argv.slice(2))
    .map((arg) => arg.startsWith("--") ? arg.slice(2).split("=") : [arg, true])
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value === undefined ? true : value,
      }),
      {},
    );

const flags = argumentsUsed();

const onlyBackend = async () => {
  inquirer.prompt(questionsForBackendTemplate).then((answers) => {
    const currentRuntime = answers.rt;

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

    let packageJson = {
      name: projectName,
      description: "A project made with love <3",
      main: "main.ts",
      keywords: [
        "vixeny",
        "functional",
        "bun",
      ],
      scripts: {},
      devDependencies: {},
      dependencies: {},
      peerDependencies: {
        "typescript": "^5.0.0",
      },
    };

    const packageJsonPath = path.join(projectPath, "package.json");

    packageJson.scripts = {
      ...packageJson.scripts,
      start: "bun run main.ts",
      dev: "bun run watcher.mjs",
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

    goodByeMessage(currentRuntime.toString(), currPath, projectName);
  });
};

const frontend = async (ob) => {
  (ob ?? inquirer.prompt(questionsForTemplate)).then((answers) => {
    const currentRuntime = answers.rt;
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

    if (currentRuntime !== "Deno") {
      let packageJson = {
        name: projectName,
        description: "A project made with love <3",
        main: "main.ts",
        keywords: [
          "vixeny",
          "functional",
          "bun",
        ],
        scripts: {},
        devDependencies: {},
        dependencies: {},
        peerDependencies: {
          "typescript": "^5.0.0",
        },
      };

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
          "vixeny-perspective": "0.1.50",
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

      fs.writeFile(
        path.join(projectPath, "package.json"),
        JSON.stringify(packageJson, null, 2),
        "utf8",
        (err) => {
          if (err) {
            return console.error(`Failed to write package.json: ${err}`);
          }
        },
      );
    }
    //Get the template
    const listOfTemplates = [
      ...new Set(
        [
          answers.installationChoice,
          answers.style,
          "typescript",
          ...(answers?.template ?? []),
        ].filter((x) => x !== "vanilla"),
      ),
    ];

    copyTemplateFiles(
      "templates/" + answers.installationChoice,
      projectPath,
    );
    copyTemplateFiles("rt/" + currentRuntime.toLowerCase(), projectPath);
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

    goodByeMessage(currentRuntime.toString(), currPath, projectName);
  });
};

if (!("test" in flags) && !(flags.test)) {
  inquirer
    .prompt(questionForMain)
    .then((answers) =>
      answers.main === "with frontned" ? frontend() : onlyBackend()
    );
} else {
  // Testing purpose

  if ("frontend" in flags) {
    const templates = template.map((x) => x.value);

    await frontend(
      new Promise(
        (res) =>
          res({
            template: templates,
            projectName: "dest",
            installationChoice: "tsx",
            style: "vanilla",
            rt: flags.rt,
            plugins: [],
          }),
      ),
    );
  }
}
