import inquirer from "inquirer";
import { exec } from "node:child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const colors = {
    A: `\x1b[31m`,
    B: `\x1b[32m`,
    C: `\x1b[33m`,

    D: `\x1b[34m`,

    R: `\x1b[0m`,
}
const terminalSpace = () => console.log("")
terminalSpace()
console.log(
    "\x1b[31m%s\x1b[0m" +  // Red for V
    "\x1b[32m%s\x1b[0m" +  // Green for i
    "\x1b[33m%s\x1b[0m" +  // Yellow for x
    "\x1b[34m%s\x1b[0m" +  // Blue for e
    "\x1b[35m%s\x1b[0m" +  // Magenta for n
    "\x1b[36m%s\x1b[0m",   // Cyan for y
    "V", "i", "x", "e", "n", "y"
);
terminalSpace()

let plugins = [
    { name: "tsx", value: "tsx" },
    { name: "jsx", value: "jsx" },
    { name: "ejs", value: "ejs" },
    { name: "pug", value: "pug" },
    { name: "postcss", value: "postcss" },
    { name: "sass", value: "sass" },
]

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageManager = await checkPackageManager("npm") ??
    await checkPackageManager("yarn") ??
    await checkPackageManager("pnpm");

const questions = [
    {
        type: "list",
        name: "installationChoice",
        message: "Welcome to Vixeny!, Which HTML template would you like?",
        choices: ["vanilla", "pug", "ejs", "jsx", "tsx"]
    },
    {
        type: "list",
        name: "style",
        message: "Which CSS engine is wanted?",
        choices: ["vanilla", "postcss", "sass"]
    },
    {
        type: "checkbox",
        name: "plugins",
        message: "Would you like to include any extra plugins?",
        choices: plugins
    },
    {
        type: "list",
        name: "runtime",
        message: "Which runtime would you prefer?",
        choices: ["bun", "deno"],
    },
    {
        type: "input",
        name: "projectName",
        message: "Where to create the project? Enter directory name or \".\":",
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
    let projectName = answers.projectName;
    const currPath = path.basename(process.cwd())
    if (projectName === ".") projectName = currPath

    let projectPath = ""
    if (projectName != currPath) {
        projectPath = path.join(process.cwd(), projectName);
    } else {
        projectPath = process.cwd()
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
                    ? "deno run -A main.ts"
                    : "bun run main.ts",
                dev: answers.runtime === "deno"
                    ? "deno run -A  watcher.mjs --liveReloading "
                    : "bun run watcher.mjs",
            };

            if (answers.answers !== "deno") {
                packageJson.dependencies = {
                    ...packageJson.dependencies,
                    "vixeny": "latest", // Assuming you want the latest version
                    "chokidar": "^3.6.0",
                    "rehype-format": "^5.0.0",
                    "rehype-stringify": "^10.0.0",
                    "remark-parse": "^11.0.0",
                    "remark-rehype": "^11.1.0",
                    "unified": "^11.0.4",
                    "vixeny-prespective": "latest",
                    "esbuild": "^0.20.1",
                };

                // pug
                if (answers.installationChoice === "pug" || answers.plugins.find(x => x === "pug")) {
                    packageJson.dependencies = {
                        ...packageJson.dependencies,
                        "pug": "^3.0.2",
                    };
                }
                // react
                if (
                    answers.installationChoice === "jsx" ||
                    answers.installationChoice === "tsx" ||
                    answers.plugins.find(x => x === "jsx" || x === "tsx")
                ) {
                    packageJson.dependencies = {
                        ...packageJson.dependencies,
                        "react": "^18.2.0",
                        "react-dom": "^18.2.0",
                    };
                }
                // ejs
                if (answers.installationChoice === "ejs" || answers.plugins.find(x => x === "ejs")) {
                    packageJson.dependencies = {
                        ...packageJson.dependencies,
                        "ejs": "^3.1.9",
                    };
                }

                if (answers.style === "sass" || answers.plugins.find(x => x === "sass")) {
                    packageJson.dependencies = {
                        ...packageJson.dependencies,
                        "sass": "^1.71.0",
                    };
                }

                if (answers.style === "postcss" || answers.plugins.find(x => x === "postcss")) {
                    packageJson.dependencies = {
                        ...packageJson.dependencies,
                        "autoprefixer": "^10.4.17",
                        "postcss": "^8.4.35",
                        "postcss-nested": "^6.0.1",
                    };
                }
            }

            packageJson.main = "main.ts";

            fs.writeFile(
                packageJsonPath,
                JSON.stringify(packageJson, null, 2),
                "utf8",
                (err) => {
                    if (err) return console.error(`Failed to write package.json: ${err}`);
                },
            );
            //Get the plugins using
            const listOfPlugins = [
                answers.installationChoice,
                answers.style,
                "typescript",
                "remark",
                ...answers?.plugins ?? [],
            ]
                .filter((x) => x !== "vanilla");

            copyTemplateFiles("templates/" + answers.installationChoice, projectPath);
            copyTemplateFiles("rt/" + answers.runtime, projectPath);
            copyTemplateFiles("css/" + answers.style, projectPath);
            copyTemplateFiles("src/", projectPath);
            listOfPlugins.forEach((x) =>
                copyTemplateFiles("plugins/" + x + "/", projectPath)
            );

            const importedList = listOfImports(listOfPlugins);
            const listForRemplace = listOfPlugins.map((x) => x + "P");

            switch (answers.installationChoice) {
                case "pug":
                    replaceOptionsAndImports(
                        projectPath,
                        importedList +
                        'import { pug } from "vixeny-prespective";\n' +
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
    template: [${listForRemplace.toString()}]};`,
                    );
                    break;
                case "ejs":
                    replaceOptionsAndImports(
                        projectPath,
                        importedList +
                        'import { ejs , ejsStaticServerPlugin } from "vixeny-prespective";\n' +
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
            terminalSpace()
            console.log(`${colors.B}# All set! Here's what to do next:`);
            terminalSpace()
            if (currPath != projectName) {
                console.log(`${colors.D}cd ${projectName}`);
            }
            if (answers.runtime === "deno") {
                console.log(
                    `${colors.D}${answers.runtime} task dev`,
                );
            } else {
                console.log(
                    `${colors.D}${answers.runtime} run dev`,
                );

            }

            terminalSpace()
            console.log(`${colors.B}# Have fun building with Vixeny!${colors.R}`);
            terminalSpace()
        });
    });
});

function copyTemplateFiles(templateName, projectPath) {
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
function replaceOptionsAndImports(
    projectPath,
    additionalImports,
    additionalOptions,
    additionalStaticServer,
) {
    const filePath = path.join(projectPath, "/src/globalOptions.ts"); // Adjust extension if necessary

    // Read the file content
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return;
        }

        let updatedContent = data.replace("///IMPORTS///", additionalImports);
        updatedContent = updatedContent.replace("///OPTIONS///", additionalOptions);
        updatedContent = updatedContent.replace(
            "///STATICSERVER///",
            additionalStaticServer,
        );

        // Write the updated content back to the file
        fs.writeFile(filePath, updatedContent, "utf8", (err) => {
            if (err) {
                console.error(`Error writing file: ${err}`);
                return;
            }
        });
    });
}
const listOfImports = (arr) =>
    arr.reduce((acc, v) =>
        acc +
        "import " + v + "P" + ' from "./plugins/' + v + '.ts"\n', "");

function checkPackageManager(packageManager) {
    return new Promise((resolve) => {
        exec(`${packageManager} -v`, (error, stdout, stderr) => {
            if (error) {
                resolve(null); // Package manager not found
            } else {
                resolve(packageManager); // Return the version number
            }
        });
    });
}
