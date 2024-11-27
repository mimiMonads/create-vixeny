import { ejsStaticServerPlugin, ejsToPetition } from "vixeny-perspective";
import { renderFile } from "ejs";
import { petitions, plugins } from "vixeny";

// Create the plugin
const plugin = ejsToPetition({
  petitions,
  renderFile,
  plugins,
});

const petition = plugin()({
  headings: {
    headers: {
      "Content-Type": "text/html",
    },
  },
  f: async ({
    defaultEJS,
  }) => defaultEJS,
});

// // Example of a petition with logic where it if the query has `message`
// const petition = plugin(globalOptions)({
//   headings:{
//     headers: '.html'
//   },
//   f: async ({
//     defaultEJS , renderEJS , query
//   }) => query && query.message
//         ? await renderEJS(query)
//         : defaultEJS,
// });

export default ejsStaticServerPlugin({
  plugins,
  options: {
    preserveExtension: false,
    petition,
  },
});
