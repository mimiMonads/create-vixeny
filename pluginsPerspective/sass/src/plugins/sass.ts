import { sassStaticServer } from "vixeny-perspective";
import * as sass from "sass";
import { petitions, plugins, vixeny } from "vixeny";

export default sassStaticServer({
  sass,
  plugins,
  petitions,
});
