import { fileURLToPath } from "node:url";
import path from "node:path";
import { cwd } from "node:process";
export const colors = {
  A: `\x1b[31m`,
  B: `\x1b[32m`,
  C: `\x1b[33m`,
  D: `\x1b[34m`,
  R: `\x1b[0m`,
};

export const template = [
  // { name: "tsx", value: "tsx" },
  { name: "jsx", value: "jsx" },
  { name: "ejs", value: "ejs" },
  { name: "pug", value: "pug" },
  { name: "postcss", value: "postcss" },
  { name: "sass", value: "sass" },
  { name: "remark", value: "remark" },
];

export let __filename = "";

try {
  __filename = fileURLToPath(import.meta.url);
} catch (error) {
  console.log(" import.meta.url is: " + import.meta.url);
  console.log(" cwd is : " + cwd());
  console.error("Error determining __filename:", error);
  throw error;
}

export const __dirname = path.dirname(__filename);

const repeatedQuestions = [
  {
    type: "list",
    name: "rt",
    message: "Which runtime?",
    choices: ["Bun", "Deno"],
  },
  {
    type: "checkbox",
    name: "plugins",
    message: "Do you want to add any plugins?",
    choices: ["typebox"],
  },
  {
    type: "input",
    name: "projectName",
    message: 'Where to create the project? Enter directory name or ".":',
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

export const questionForMain = [
  {
    type: "list",
    name: "main",
    message: "Welcome to Vixeny!, what kind of template do you need?",
    choices: ["with frontned", "just backend"],
  },
];

export const questionsForTemplate = [
  {
    type: "list",
    name: "installationChoice",
    message: " Which HTML template would you like?",
    choices: [
      "pug",
      "ejs",
      "jsx",
      //"tsx",
    ],
  },
  {
    type: "list",
    name: "style",
    message: "Which CSS engine is wanted?",
    choices: ["vanilla", "postcss", "sass"],
  },
  {
    type: "checkbox",
    name: "template",
    message: "Would you like to include any extra template?",
    choices: template,
  },
  ...repeatedQuestions,
];

export const questionsForBackendTemplate = [...repeatedQuestions];
