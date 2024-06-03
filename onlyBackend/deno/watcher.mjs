let currentProcess = new Deno.run({
  cmd: [
    Deno.execPath(),
    "run",
    "-A",
    "--unstable-ffi",
    "main.ts",
    "--liveReloading",
  ],
  stdout: "inherit",
  stderr: "inherit",
});

async function killAndAwaitProcess() {
  if (currentProcess) {
    Deno.kill(currentProcess.pid, "SIGTERM");
    await currentProcess.status(); // Wait for the process to exit
    currentProcess.close(); // Clean up resources
    currentProcess = null; // Reset the process variable
  }
}

async function runDenoProcess() {
  await killAndAwaitProcess(); // Ensure the previous process is fully terminated

  currentProcess = new Deno.run({
    cmd: [
      Deno.execPath(),
      "run",
      "-A",
      "--unstable-ffi",
      "main.ts",
      "--liveReloading",
    ],
    stdout: "inherit",
    stderr: "inherit",
  });
}

// Watch for changes, excluding .git and node_modules
const watcher = Deno.watchFs(".", { recursive: true });

let debounceTimer;

for await (const event of watcher) {
  if (
    event.paths.some((path) =>
      !path.includes(".git") && !path.includes("node_modules")
    )
  ) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      console.clear();
      await runDenoProcess(); // Start the process anew
    }, 100); // Debounce time to prevent rapid restarts
  }
}

await killAndAwaitProcess();
