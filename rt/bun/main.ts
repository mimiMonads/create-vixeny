import { vixeny , wrap} from "vixeny";
import root from "./src/paths/root.ts";
import { globalOptions , staticServer} from "./src/globalOptions.ts";


Bun.serve({
  fetch: vixeny(globalOptions)([
    ...wrap(globalOptions)()
      .union(root.unwrap())
      .unwrap(),
    //with static server
    staticServer
  ]),
});

console.log('Server in : ' + globalOptions.hasName)
