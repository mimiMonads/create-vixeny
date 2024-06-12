import { jsxStaticServer } from "vixeny-perspective";

import * as Dom from "react-dom/server";
import * as React from "react";

export default jsxStaticServer(Dom)(React)({
  //@ts-ignore
  root: typeof Deno !== "undefined" ? "file://" + Deno.cwd() : process.cwd(),
});
