import root from "./src/paths/root.ts";

Deno.serve(
  { port: 3000 },
  await root.compose(),
);
