import { postcssStaticServer } from "vixeny-prespective";
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
