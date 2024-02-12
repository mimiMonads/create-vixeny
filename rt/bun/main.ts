import { vixeny , wrap} from "vixeny";
import { staticServerPlugings } from "vixeny-prespective";
import root from "./src/paths/root.ts";
import { globalOptions } from "./src/globalOptions.ts";


Bun.serve({
  fetch: vixeny(globalOptions)([
    ...wrap(globalOptions)()
      .union(root.unwrap())
      .unwrap(),
    //with static server
    {
      type: "fileServer",
      name: "/public",
      path: "./views/public/",
      //it has options
      template: staticServerPlugings.pug(),
    },
  ]),
});
