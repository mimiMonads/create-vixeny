import * as Dom from "react-dom/server";
import * as React from "react";
import * as esbuild from "esbuild";
import { tsxStaticServer } from "vixeny-perspective";

export default tsxStaticServer(Dom)(React)(esbuild)();
