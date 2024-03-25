import { vixeny, wrap } from "vixeny";
import root from "./src/paths/root.ts";
import api from "./src/paths/api.ts";
import { globalOptions, fileServer } from "./src/globalOptions.ts";

Deno.serve(
  { port: 3000 },
  vixeny(globalOptions)([
    ...wrap(globalOptions)()
      .union(root.unwrap())
      .union(api.unwrap())
      .unwrap(),
    //with static server
    fileServer,
  ]),
);
