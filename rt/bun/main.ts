import { vixeny, wrap } from "vixeny";
import root from "./src/paths/root.ts";
import { fileServer, globalOptions } from "./src/globalOptions.ts";

Bun.serve({
  fetch: vixeny(globalOptions)([
    ...wrap(globalOptions)()
      .union(root.unwrap())
      .unwrap(),
    //with static server
    fileServer,
  ]),
});

console.log("Server in : " + globalOptions.hasName);
