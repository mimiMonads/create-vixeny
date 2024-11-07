import { ejsStaticServerPlugin } from "vixeny-perspective";
import { renderFile } from "ejs";
import { petitions, plugins } from "vixeny";

export default ejsStaticServerPlugin({
  renderFile,
  plugins,
  petitions,
  options: {
    preserveExtension: false,
  },
});
