import { pugStaticServerPlugin } from "vixeny-prespective";
import  * as pugModule  from "pug";

export default pugStaticServerPlugin(pugModule.compileFile)({
    preserveExtension: false
  })