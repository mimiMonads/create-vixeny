import { jsxStaticServerPlugin, jsxToPetition } from "vixeny-perspective";
import { petitions, plugins, runtime } from "vixeny";
import process from "node:process";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";

const currentRt = runtime.name();

const root = currentRt == "Deno"
  //@ts-ignore
  ? "file://" + Deno.cwd()
  : process.cwd();

const plugin = jsxToPetition({
  ReactDOMServer,
  React,
  root,
  petitions,
  plugins,
});

const petition = plugin()({
  headings: {
    headers: ".html",
  },
  f: ({ defaultJSX }) => defaultJSX,
});

export default jsxStaticServerPlugin({
  plugins,
  options: {
    root,
    petition,
  },
});
