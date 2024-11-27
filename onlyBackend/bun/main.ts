import root from "./src/paths/root.ts";

Bun.serve({
  fetch: await root.compose(),
});
