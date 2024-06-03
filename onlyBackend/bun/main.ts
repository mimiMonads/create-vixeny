import { vixeny, wrap } from "vixeny";
import root from "./src/paths/root.ts";
import { globalOptions } from "./src/globalOptions.ts";

Bun.serve({
  fetch: vixeny(globalOptions)([
    ...wrap(globalOptions)()
      .union(root.unwrap())
      .unwrap(),
  ]),
});

console.log("Server in : " + globalOptions?.indexBase.bind);
