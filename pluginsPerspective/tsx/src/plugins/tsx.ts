import * as ReactDOMServer from "react-dom/server";
import * as React from "react";
import { tsxStaticServerPlugin, tsxToPetition } from "vixeny-perspective";
import { petitions, plugins, runtime } from "vixeny";

const currentRt = runtime.name();

const root = currentRt == "Deno"
  //@ts-ignore
  ? "file://" + Deno.cwd()
  : process.cwd();

const plugin = tsxToPetition({
  petitions,
  React,
  ReactDOMServer,
  plugins,
  root,
});

const petition = plugin()({
  headings: {
    headers: ".html",
  },
  f: ({ defaultTSX }) => defaultTSX,
});

export default tsxStaticServerPlugin({
  plugins,
  options: {
    preserveExtension: false,
    petition,
    root,
  },
});
