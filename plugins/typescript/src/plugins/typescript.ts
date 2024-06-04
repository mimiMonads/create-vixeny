import { typescriptStaticServer } from "vixeny-perspective";

import esm from "esbuild";

export default typescriptStaticServer(esm)();
