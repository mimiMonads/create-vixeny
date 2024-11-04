import { jsxStaticServer } from "vixeny-perspective";
import { petitions, plugins, vixeny } from "vixeny";
import process from "node:process";
import * as Dom from "react-dom/server";
import * as React from "react";

export default jsxStaticServer({
  React,
  Dom,
  petitions,
  plugins,
  opt: {
    root: process.cwd(),
  },
});
