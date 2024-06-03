import { wrap } from "vixeny";
import { globalOptions } from "../globalOptions.ts";

export default wrap(globalOptions)()
  .petitionWithoutCTX({
    path: "/",
    r: () => new Response("Hi"),
  })
  .stdPetition({
    path: "/id/:id",
    headings: {
      headers: new Headers([[
        "x-powered-by",
        "benchmark",
      ]]),
    },
    param: {
      unique: true,
    },
    query: {
      unique: true,
      name: "name",
    },
    f: (f) => f.param + " " + f.query,
  })
  .stdPetition({
    path: "/json",
    method: "POST",
    headings: {
      headers: new Headers([[
        "content-type",
        "application/json",
      ]]),
    },
    f: async (f) => JSON.stringify(await f.req.json()),
  });
