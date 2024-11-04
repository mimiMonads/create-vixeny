import { pugStaticServerPlugin } from "vixeny-perspective";
import { petitions, plugins } from "vixeny";
import { compileFile } from "pug";

export default pugStaticServerPlugin({
  compileFile,
  plugins,
  petitions,
  option: {
    preserveExtension: false,
  },
});
