import { wrap } from "vixeny";
import { globalOptions } from "../globalOptions.ts";

export default wrap(globalOptions)()
  .get({
    path: "/ping",
    f: () => "pong",
  });
