import { jsxStaticServer } from "vixeny-perspective";
import { petitions, plugins } from "vixeny";
import process from "node:process";
import * as Dom from "react-dom/server";
import * as React from "react";

export default jsxStaticServer({
  React,
  Dom,
  petitions,
  plugins,
  options: {
    //@ts-ignore
    root: typeof Deno !== "undefined" ? "file://" + Deno.cwd() : process.cwd(),
  },
});
