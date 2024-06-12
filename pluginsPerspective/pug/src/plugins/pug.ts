import { pugStaticServerPlugin } from "vixeny-perspective";
import * as pugModule from "pug";

export default pugStaticServerPlugin(pugModule.compileFile)({
  preserveExtension: false,
});
