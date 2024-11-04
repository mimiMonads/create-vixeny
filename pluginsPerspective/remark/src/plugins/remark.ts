import { PluginTuple, unified } from "unified";
import { remarkStaticServer } from "vixeny-perspective";
import { petitions, plugins } from "vixeny";

import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

export default remarkStaticServer({
  unified,
  plugins,
  petitions,
  options: {
    preserveExtension: false,
    uses: [
      [remarkParse] as PluginTuple,
      [remarkRehype] as unknown as PluginTuple,
      [rehypeDocument, { title: "👋🌍" }] as unknown as PluginTuple,
      [rehypeFormat] as unknown as PluginTuple,
      [rehypeStringify] as unknown as PluginTuple,
      [remarkRehype] as unknown as PluginTuple,
    ],
  },
});
