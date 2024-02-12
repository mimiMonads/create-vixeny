// Ensure you have the necessary permissions to run this script:
// deno run --allow-read --allow-run your_script.ts

async function runDenoProcess() {
  const process = Deno.run({
    cmd: ["deno", "run", "--allow-all", "main.ts"], // Adjust permissions as needed
    stdout: "inherit",
    stderr: "inherit",
  });

  // Wait for the process to exit and log the exit status
  const { code } = await process.status();
  console.log(`Subprocess exited with code ${code}`);
  process.close();
}

// Watch for changes in the current directory, excluding .git and node_modules
const watcher = Deno.watchFs(".", { recursive: true });

let debounceTimer;

for await (const event of watcher) {
  // Filter out changes in .git and node_modules directories
  if (
    event.paths.some((path) =>
      !path.includes(".git") && !path.includes("node_modules")
    )
  ) {
    console.clear();
    console.log("Detected changes:", event.paths);

    // Debounce the restart to avoid triggering multiple restarts for batches of file changes
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      await runDenoProcess();
    }, 100); // Adjust debounce time as needed
  }
}
