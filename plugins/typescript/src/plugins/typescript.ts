import { typescriptStaticServer } from "vixeny-prespective";

import esm from "esbuild";

export default typescriptStaticServer(esm)();
