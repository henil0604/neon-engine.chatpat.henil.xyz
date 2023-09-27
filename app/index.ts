import ServerFactory from "@/core/ServerFactory.js";
import getRouterFactory from "@/modules/getRouterFactory.js";

const Factory = new ServerFactory();

Factory.start()

Factory.addRoute(getRouterFactory("/"))