import ServerFactory from "@/core/ServerFactory.js";
import getRouterFactory from "@/modules/getRouterFactory.js";
import Env from "@/modules/Env.js";

// making a instance of ServerFactory
const Factory = new ServerFactory();

await Factory.preprocess();

// listening on server startup
Factory.emitter.on('start', (timestamp) => {
    console.log(`Server started on port ${Env.get("PORT")}`)
});

// Adding a Routes
Factory.addRoute(getRouterFactory("/"));

// Starting the server
Factory.start();