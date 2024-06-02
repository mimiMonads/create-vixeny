import { plugins, runtime } from "vixeny";

///IMPORTS///

///remark//

const values = runtime.arguments();

const globalOptions = plugins.globalOptions({
  hasName: "http://localhost:3000/",
  ...(values?.liveReloading
    ? {
      enableLiveReloading: true,
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


