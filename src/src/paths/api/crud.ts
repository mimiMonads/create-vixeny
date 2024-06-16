import { wrap } from "vixeny";
import { cryptoKey, globalOptions } from "../../globalOptions.ts";
import { addItem, deleteByID, getFirst10 } from "../../branch/api.ts";
import { isValidUser } from "../../resolve/api.ts";

const path = globalOptions.hasName;

export default wrap({
  ...globalOptions,
  wrap: {
    startWith: "/crud",
  },
})()
  .customPetition({
    path: "/getAll",
    method: "POST",
    branch: {
      getFirst10,
    },
    crypto: { ...cryptoKey },
    f: ({ token , branch }) =>
      token.jwtToken &&
        (token.jwtToken as ({ iat: number })).iat > Date.now()
        ? new Response(JSON.stringify(branch.getFirst10(null)))
        : new Response(null, {
          status: 401,
        }),
  })
  .customPetition({
    path: "/delete/:id",
    method: "POST",
    branch: {
      deleteByID,
    },
    crypto: { ...cryptoKey, token: { jwtToken: {} } },
    f: ({ token , branch , param}) =>
      token.jwtToken &&
        (token.jwtToken as ({ iat: number })).iat > Date.now()
        ? new Response(void branch.deleteByID(param.id) ?? null)
        : new Response(null, {
          status: 401,
        }),
  })
  .customPetition({
    path: "/create",
    method: "POST",
    resolve: {
      isValidUser,
    },
    branch: {
      addItem,
    },
    f: ({ resolve , branch}) => {
      if (
        resolve.isValidUser === null
      ) {
        return new Response(null, {
          status: 401,
        });
      }
      const user = resolve.isValidUser.get("name") ?? null,
        price = resolve.isValidUser.get("price") ?? null;

      if (user === null || price === null) {
        return new Response(null, {
          status: 400,
        });
      }

      branch.addItem([user, price]);

      return new Response(null, {
        status: 302,
        headers: {
          "Location": path + "api/panel",
        },
      });
    },
  });
