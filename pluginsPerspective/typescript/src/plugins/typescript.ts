import { typescriptStaticServer } from "vixeny-perspective";
import { petitions, plugins } from "vixeny";
import esbuild from "esbuild";

export default typescriptStaticServer({
  plugins,
  esbuild,
  petitions,
});
