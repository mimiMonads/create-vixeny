import { pugStaticServerPlugin, pugToPetition } from "vixeny-perspective";
import { petitions, plugins } from "vixeny";
import { compileFile } from "pug";

// Create the plugin
const plugin = pugToPetition({
  petitions,
  compileFile,
  plugins,
});

const petition = plugin({})({
  headings: {
    headers: ".html",
  },
  f: ({
    defaultPug,
  }) => defaultPug,
});

export default pugStaticServerPlugin({
  plugins,
  options: {
    preserveExtension: false,
    petition,
  },
});
