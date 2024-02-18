import { unified , PluginTuple } from "unified";
import { remarkStaticServer } from "vixeny-prespective";

import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

export default  remarkStaticServer(unified)(    
  {uses:[
      [remarkParse]  as PluginTuple ,
      [remarkRehype] as unknown as PluginTuple ,
      [rehypeDocument, {title: '👋🌍'}] as unknown as PluginTuple,
      [rehypeFormat]  as unknown as PluginTuple,
      [rehypeStringify] as unknown as PluginTuple,
      [remarkRehype] as unknown as PluginTuple 
  ]
  })