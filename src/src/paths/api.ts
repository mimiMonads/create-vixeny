import { wrap } from "vixeny";
import { cryptoKey, globalOptions } from "../globalOptions.ts";
import { getFormDataResolve, validToken } from "../resolve/api.ts";
import { getUserBranch } from "../branch/api.ts";
import crud from "./api/crud.ts";

const path = globalOptions.hasName;

export default wrap({
  ...globalOptions,
  //setting name of this dir
  wrap: {
    startWith: "/api",
  },
})()
  .union(crud.unwrap())
  .customPetition({
    path: "/panel",
    // resolve isUserResolve can be used instead
    resolve: {
      validToken,
    },
    f: async ({ resolve, io}) => {

      return resolve.validToken !== null
        ? new Response(
          await io.textOf("./views/private/panel.html"),
          {
            headers: new Headers([["Content-Type", "text/html"]]),
          },
        )
        : new Response(
          await io.textOf("./views/public/login.html"),
          {
            headers: new Headers([["Content-Type", "text/html"]]),
            status: 401,
          },
        );
    },
  })
  .customPetition({
    path: "/login",
    method: "POST",
    crypto: { ...cryptoKey },
    resolve: {
      getFormDataResolve,
    },
    branch: {
     getUserBranch,
    },
    f: async ({ resolve, io , branch , sign , date}) => {
      const user = resolve.getFormDataResolve.get("user") ?? null,
        pass = resolve.getFormDataResolve.get("pass") ?? null;

      if (!user || !pass) {
        return new Response(
          await io.textOf("./views/public/login.html"),
          {
            headers: new Headers([["Content-Type", "text/html"], [
              "Set-Cookie",
              "jwtToken=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
            ]]),
            status: 401,
          },
        );
      }

      const sql = branch.getUserBranch([user, pass]);

      if (sql.length > 0) {
        return new Response(null, {
          status: 302,
          headers: new Headers([
            [
              "Set-Cookie",
              `jwtToken=${
                sign({
                  user: sql[0][1],
                  iat: date + 600000,
                })
              }; Path=/; HttpOnly`,
            ],
            [
              "Location",
              path + "api/panel",
            ],
          ]),
        });
      }
      return new Response(
        await io.textOf("./views/public/login.html"),
        {
          headers: new Headers([["Content-Type", "text/html"]]),
          status: 401,
        },
      );
    },
  })
  .stdPetition({
    path: "/clear",
    headings: {
      headers: new Headers([
        [
          "Set-Cookie",
          "jwtToken=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        ],
        [
          "Location",
          path,
        ],
      ]),
      status: 302,
    },
    f: () => null,
  });
