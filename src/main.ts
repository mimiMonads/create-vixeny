import { vixeny, wrap } from "vixeny";
import { serve } from "vixeny-perspective";
import root from "./src/paths/root.ts";
import { fileServer, globalOptions } from "./src/globalOptions.ts";

serve({
  handler: vixeny(globalOptions)([
    ...wrap(globalOptions)()
      .union(root.unwrap())
      .unwrap(),
    //with static server
    fileServer,
  ]),
  port: 3000
});


