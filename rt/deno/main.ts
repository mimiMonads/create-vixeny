import { vixeny, wrap } from "vixeny";
import root from "./src/paths/root.ts";
import { globalOptions, staticServer } from "./src/globalOptions.ts";

Deno.serve(
  { port: 3000 },
  vixeny(globalOptions)([
    ...wrap(globalOptions)()
      .union(root.unwrap())
      .unwrap(),
    //with static server
    staticServer,
  ]),
);
