import { plugins, runtime } from "vixeny";
import { injectable } from "vixeny-perspective";

///IMPORTS///

///remark//

const values = runtime.arguments();

const globalOptions = plugins.globalOptions({
  ...(values?.liveReloading
    ? {
      debugging: {
        injectHtml: injectable({
          //@ts-ignore
          hostname: "127.0.0.1",
          port: 3000,
        }),
      },
    }
    : {}),
  ///OPTIONS///
});

const cryptoKey = {
  globalKey: crypto.randomUUID(),
};

//static server

///STATICSERVER///

//export
