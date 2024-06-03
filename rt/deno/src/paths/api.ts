import { wrap } from "vixeny";
import { cryptoKey, globalOptions } from "../globalOptions.ts";
import { getFormDataResolve, validToken } from "../resolve/api.ts";
import { getUserBranch } from "../branch/api.ts";
import crud from "./api/crud.ts";

const path = globalOptions.hasName;

export default wrap({
  ...globalOptions,
  //seting name of this dir
  startWith: "/api",
})()
  .union(crud.unwrap())
  .customPetition({
    path: "/panel",
    // resolve isUserResolve can be used instead
    resolve: {
      isValid: validToken,
    },
    f: async (f) => {
      return f.resolve.isValid !== null
        ? new Response(
          await Deno.readTextFile("./views/private/panel.html"),
          {
            headers: new Headers([["Content-Type", "text/html"]]),
          },
        )
        : new Response(
          await Deno.readTextFile("./views/public/login.html"),
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
      formData: getFormDataResolve,
    },
    branch: {
      getUser: getUserBranch,
    },
    f: async (f) => {
      const user = f.resolve.formData.get("user") ?? null,
        pass = f.resolve.formData.get("pass") ?? null;

      if (!user || !pass) {
        return new Response(
          await Deno.readTextFile("./views/public/login.html"),
          {
            headers: new Headers([["Content-Type", "text/html"], [
              "Set-Cookie",
              "jwtToken=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
            ]]),
            status: 401,
          },
        );
      }

      const sql = f.branch.getUser([user, pass]);

      if (sql.length > 0) {
        return new Response(null, {
          status: 302,
          headers: new Headers([
            [
              "Set-Cookie",
              `jwtToken=${
                f.sign({
                  user: sql[0][1],
                  iat: f.date + 600000,
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
        await Deno.readTextFile("./views/public/login.html"),
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
    f: () => "",
  });
