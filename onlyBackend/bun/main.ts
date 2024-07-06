import root from "./src/paths/root.ts";

Bun.serve({
  fetch: root.compose(),
});
