import { assertOptions } from "vixeny";
import parser from "vixeny/components/runtime/parseArguments.mjs";
///IMPORTS///
///remark//
const values = parser();

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

assertOptions(globalOptions);
export { cryptoKey, globalOptions, staticServer };
