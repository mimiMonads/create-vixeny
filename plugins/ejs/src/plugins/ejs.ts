import { ejsStaticServerPlugin } from "vixeny-prespective";
import * as ejsModule from "ejs";

export default ejsStaticServerPlugin(ejsModule.renderFile)({
  preserveExtension: false,
});
