import { vixeny, wrap } from "vixeny";
import root from "./src/paths/root.ts";
import api from "./src/paths/api.ts";
import { fileServer, globalOptions } from "./src/globalOptions.ts";

Bun.serve({
  fetch: vixeny(globalOptions)([
    ...wrap(globalOptions)()
      .union(root.unwrap())
      .union(api.unwrap())
      .unwrap(),
    //with static server
    fileServer,
  ]),
});

console.log("Server in : " + globalOptions.hasName);
