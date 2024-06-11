import { exec } from "node:child_process";
import { colors } from "./config.mjs";

export const terminalSpace = () => console.log("");

export const goodByeMessage = (runtime, currPath, projectName) => {
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

export function checkPackageManager(packageManager) {
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

export const listOfImports = (arr) =>
  arr.reduce((acc, v) =>
    acc +
    "import " + v + "P" + ' from "./plugins/' + v + '.ts"\n', "");
