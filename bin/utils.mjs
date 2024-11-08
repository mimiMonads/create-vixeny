import { colors } from "./config.mjs";

export const terminalSpace = () => console.log("");

export const goodByeMessage = (runtime, currPath, projectName) => {
  runtime = runtime.toLowerCase();
  terminalSpace();
  console.log(`${colors.B}# All set! Here's what to do next:`);
  terminalSpace();
  if (currPath != projectName) {
    console.log(`${colors.D}cd ${projectName}`);
  }
  if (runtime === "deno") {
    console.log(`${colors.D}${runtime} task dev`);
  } else {
    console.log(`${colors.D}${runtime} i`);
    console.log(`${colors.D}${runtime} run dev`);
  }
  terminalSpace();
  console.log(`${colors.B}# Have fun building with Vixeny!${colors.R}`);
  terminalSpace();
};

export const listOfImports = (arr) =>
  arr.reduce((acc, v) =>
    acc +
    "import " + v + "P" + ' from "./plugins/' + v + '.ts"\n', "");
