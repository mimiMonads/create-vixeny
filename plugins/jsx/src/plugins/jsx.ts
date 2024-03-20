import { jsxStaticServer } from "vixeny-prespective";

import * as Dom from "react-dom/server";
import * as React from "react";

export default jsxStaticServer(Dom)(React)({
  //@ts-ignore
  root: typeof Deno !== "undefined" ? "file://" + Deno.cwd() : process.cwd(),
});
