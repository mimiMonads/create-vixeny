import chokidar from "chokidar";
import { spawn } from "node:child_process";

let bunProcess = null;

const runBun = () => {
  if (bunProcess !== null) {
    bunProcess.kill(); // Kill the previous process, if it exists
    bunProcess = null;
    console.clear();
  }

  // Start the Bun process
  bunProcess = spawn("bun", ["main.ts"], { stdio: "inherit" });

  bunProcess.on("error", (err) => {
    console.error(`Failed to start subprocess: ${err}`);
  });
};

// Initialize chokidar to watch all files except those in node_modules and dotted files
const watcher = chokidar.watch("**/*", {
  ignored: /(^|[\/\\])(\..|node_modules)/, // Ignore dotted files and node_modules
  persistent: true,
});

// Event listeners for the watcher
watcher
  .on("add", (path) => {
    //console.log(`File ${path} has been added`);
    runBun();
  })
  .on("change", (path) => {
    //console.log(`File ${path} has been changed`);

    runBun();
  })
  .on("unlink", (path) => {
    //console.log(`File ${path} has been removed`);
    runBun();
  });

// Run bun main.ts initially
runBun();

// Optional: Clean up on process exit
process.on("exit", () => watcher.close());
process.on("SIGINT", () => process.exit()); // Handle Ctrl+C gracefully
