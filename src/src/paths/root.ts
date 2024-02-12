import { wrap } from "vixeny";
import { globalOptions } from "../globalOptions.ts";

const path = globalOptions.hasName;

export default wrap(globalOptions)()
  .customPetition({
    path: "/",
    f: () => new Response('Hello world!'),
  })
  .stdPetition({
    path: "/ping",
    f: () => "pong",
  });