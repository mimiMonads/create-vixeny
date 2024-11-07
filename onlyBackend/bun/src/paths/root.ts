import { wrap } from "vixeny";
import { globalOptions } from "../globalOptions.ts";

export default wrap(globalOptions)()
  .get({
    path: "/",
    f: () => new Response("Hi"),
  })
  .get({
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
  .post({
    path: "/json",
    headings: {
      headers: new Headers([[
        "content-type",
        "application/json",
      ]]),
    },
    f: async (f) => JSON.stringify(await f.req.json()),
  });
