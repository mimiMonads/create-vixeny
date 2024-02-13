///IMPORTS///
import { assertOptions } from "vixeny";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    enableLiveReloading: {
      type: 'boolean',
    },
  },
  strict: true,
  allowPositionals: true,
});

const globalOptions = {
  hasName: "http://localhost:3000/",
  ...(values.enableLiveReloading ? {
    enableLiveReloading:true as const
  } : {})
  ///OPTIONS///
};

const cryptoKey = {
  globalKey: crypto.randomUUID(),
};

///STATICSERVER///


assertOptions(globalOptions);
export { cryptoKey , globalOptions , staticServer };