import { vixeny, wrap } from "vixeny";
import { staticServerPlugings } from "vixeny-prespective";

Bun.serve({
  fetch: vixeny({
    enableLiveReloading: true,
  })([
    {
      path: "/",
      f: () => "hello world",
    },
    //with static server
    {
      type: "fileServer",
      name: "/public",
      path: "./views/public/",
      //it has options
      template: staticServerPlugings.pug(),
    },
  ]),
});
