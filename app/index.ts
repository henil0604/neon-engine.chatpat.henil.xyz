import ServerFactory from "@/modules/ServerFactory.js";
import getRouterFactory from "@/modules/getRouterFactory.js";
import Env from "@/modules/Env.js";
import { SocketHandlerInitializer } from "@/SocketHandlers/init.js";

// declare global {
//     var Factory: ServerFactory;
// }

// making a instance of ServerFactory
const Factory = new ServerFactory();

global.Factory = Factory;

await Factory.preprocess();

// listening on server startup
Factory.emitter.on('start', (timestamp) => {
    console.log(`Server started on port ${Env.get("PORT")}`)
});

// Adding a Routes
Factory.addRoute(getRouterFactory("/"));
Factory.addRoute(getRouterFactory("/auth"));
Factory.addRoute(getRouterFactory("/auth/oauth"));
Factory.addRoute(getRouterFactory("/auth/oauth/github"));
Factory.addRoute(getRouterFactory("/auth/oauth/github/callback"));

SocketHandlerInitializer()

// Starting the server
Factory.start();