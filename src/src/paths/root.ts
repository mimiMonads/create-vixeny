import { wrap } from "vixeny";
import { globalOptions } from "../globalOptions.ts";

const path = globalOptions.hasName;

export default wrap(globalOptions)()
  .stdPetition({
    path: "/ping",
    f: () => "pong",
  });
