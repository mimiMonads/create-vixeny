import { ejsStaticServerPlugin } from "vixeny-perspective";
import * as ejsModule from "ejs";

export default ejsStaticServerPlugin(ejsModule.renderFile)({
  preserveExtension: false,
});
