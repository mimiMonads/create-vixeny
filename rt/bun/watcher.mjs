const fs = require("fs");
const path = require("path");

let bunProcess = null;

const formatTime = () => {
  return new Date().toLocaleTimeString();
};

const runBun = () => {
  if (bunProcess !== null) {
    bunProcess.kill(); 
    bunProcess = null;
    console.clear();
  }

  // Start the Bun process
  bunProcess = Bun.spawn(["bun", "run", "main.ts", "--liveReloading"], {
    stdio: ["inherit", "inherit", "inherit"]
  });

  bunProcess.exited.then(
    //(exitCode) => {console.log(`[${formatTime()}] Process exited with code: ${exitCode}`);}
    null)
    .catch(
    //  (error) => {console.error(`[${formatTime()}] Failed to start subprocess: ${error}`);}
      null
    );
};

const watchedDir = path.resolve("./");
let lastModified = {};

const pollFiles = (directory) => {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`[${formatTime()}] ${err}`);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(directory, file.name);
      if (file.isDirectory()) {
        if (file.name !== "node_modules") { 
          pollFiles(filePath); 
        }
      } else {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            return;
          }

          const lastModifiedTime = stats.mtime.getTime();
          if (lastModified[filePath] !== lastModifiedTime) {
            lastModified[filePath] = lastModifiedTime;
            console.log(`[${formatTime()}] File changed: ${filePath}`);
            runBun();
          }
        });
      }
    });
  });
};

runBun();
setInterval(() => pollFiles(watchedDir), 1000);

process.on("exit", () => {
  if (bunProcess) {
    bunProcess.kill();
  }
});
process.on("SIGINT", () => {
  console.log(`[${formatTime()}] Terminating...`);
  process.exit();
});
