import { PluginTuple, unified } from "unified";
import { remarkStaticServer } from "vixeny-prespective";

import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

export default remarkStaticServer(unified)({
  preserveExtension: false,
  uses: [
    [remarkParse] as PluginTuple,
    [remarkRehype, { allowDangerousHtml: true }] as unknown as PluginTuple,
    [rehypeFormat] as unknown as PluginTuple,
    [rehypeStringify, { allowDangerousHtml: true }] as unknown as PluginTuple,
  ],
});
