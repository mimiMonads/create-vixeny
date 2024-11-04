import { postcssStaticServer } from "vixeny-perspective";
import { petitions, plugins } from "vixeny";
import postcss from "postcss";
import postcssNested from "postcss-nested";
import autoprefixer from "autoprefixer";

export default postcssStaticServer({
  postcss,
  plugins,
  petitions,
  options: {
    uses: [
      autoprefixer,
      postcssNested,
    ] as (postcss.AcceptedPlugin)[],
  },
});
