import { plugins, runtime } from "vixeny";
import { injectable } from "vixeny-perspective";

///IMPORTS///

///remark//

const values = runtime.arguments();


const globalOptions = plugins.globalOptions({
  ...(values?.liveReloading
    ? {
      debugging:{
        injectHtml: injectable({
          port: 3000
        })
      }
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
