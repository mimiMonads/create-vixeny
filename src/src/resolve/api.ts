import { petitions } from "vixeny";
import { cryptoKey, globalOptions } from "../globalOptions.ts";

const getFormDataResolve = petitions.resolve(globalOptions)({
  f: async (f) => await f.req.formData(),
});

const validToken = petitions.resolve(globalOptions)({
  crypto: {
    ...cryptoKey,
    token: { jwtToken: {} },
  },
  f: (c) =>
    c.token.jwtToken &&
      (c.token.jwtToken as { name: string; iat: number }).iat > Date.now()
      ? c.token.jwtToken
      : null,
});

const isValidUser = petitions.resolve(globalOptions)({
  crypto: {
    ...cryptoKey,
    token: { jwtToken: {} },
  },
  f: async (c) =>
    c.token.jwtToken &&
      (c.token.jwtToken as { name: string; iat: number }).iat > Date.now()
      ? await c.req.formData()
      : null,
});

export { getFormDataResolve, isValidUser, validToken };
