import { plugins, runtime } from "vixeny";

///IMPORTS///

///remark//

const values = runtime.arguments();

const globalOptions = {
  hasName: "http://localhost:3000/",
  ...(values?.liveReloading
    ? {
      enableLiveReloading: true as const,
    }
    : {}),

  ///OPTIONS///
  
};

const cryptoKey = {
  globalKey: crypto.randomUUID(),
};

///STATICSERVER///

plugins.assertOptions(globalOptions);

export { cryptoKey, globalOptions, staticServer };
