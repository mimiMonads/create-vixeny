import { vixeny, wrap } from "vixeny";
import {  staticServerPlugings } from "vixeny-prespective"; // Importing the plugin options

//ddd

// Example of setting up a Vixeny app with Pug template rendering in Bun in http://localhost:3000/ 

Bun.serve({
  fetch: vixeny({
    enableLiveReloading: true
  })([
    {
        path: '/',
        f: () => 'hello world'
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