import { postcssStaticServer } from "vixeny-perspective";
import postcss from "postcss";
import postcssNested from "postcss-nested";
import autoprefixer from "autoprefixer";

export default postcssStaticServer(postcss)(
  {
    uses: [
      autoprefixer,
      postcssNested,
    ] as (postcss.AcceptedPlugin)[],
  },
);
