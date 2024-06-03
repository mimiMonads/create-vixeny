import { plugins, runtime } from "vixeny";

const values = runtime.arguments();

const globalOptions = plugins.globalOptions({
  indexBase: {
    bind: "http://localhost:3000/",
  },
  ...(values?.liveReloading
    ? {
      enableLiveReloading: true,
    }
    : {}),
});

export { globalOptions };
