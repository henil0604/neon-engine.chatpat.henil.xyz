import ServerFactory from "@/core/ServerFactory.js";
import getRouterFactory from "@/modules/getRouterFactory.js";

// making a instance of ServerFactory
const Factory = new ServerFactory();

// Adding a Routes
Factory.addRoute(getRouterFactory("/"));

// listening on server startup
Factory.emitter.on('start', (timestamp) => {
    console.log(`Server started on port ${Factory.server.info.port}`)
});

// Starting the server
Factory.start();