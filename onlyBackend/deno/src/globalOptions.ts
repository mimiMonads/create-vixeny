import { plugins } from "vixeny";

const globalOptions = plugins.globalOptions({
  indexBase: {
    bind: "http://localhost:3000/",
  },
});

export { globalOptions };
