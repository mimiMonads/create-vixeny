import { wrap } from "vixeny";
import { globalOptions } from "../globalOptions.ts";

export default wrap(globalOptions)()
  .stdPetition({
    path: "/ping",
    f: () => "pong",
  });
