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

//static server

///STATICSERVER///

//checking if the function works
plugins.assertOptions(globalOptions);


//export


