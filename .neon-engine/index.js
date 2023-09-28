var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// app/routes/index.ts
var routes_exports = {};
__export(routes_exports, {
  factory: () => factory
});
var factory;
var init_routes = __esm({
  "app/routes/index.ts"() {
    "use strict";
    factory = /* @__PURE__ */ __name((ctx) => {
      return {
        method: "GET",
        path: "/",
        handler: (request, h) => {
          return "Hello!";
        }
      };
    }, "factory");
  }
});

// app/modules/Database.ts
import { PrismaClient } from "@prisma/client";
var globalForPrisma = globalThis;
var isDev = process.env.NODE_ENV === "development";
var db = globalForPrisma.prisma ?? // if the global object already has prisma, use it
new PrismaClient({
  log: isDev ? ["query", "error", "warn"] : ["error"]
});
if (isDev)
  globalForPrisma.prisma = db;

// app/modules/Env.ts
import dotenv from "dotenv";
import { z } from "zod";
var _Env = class {
  constructor() {
  }
  static parse(schema, value) {
    return schema.parse(value);
  }
  static get(key) {
    dotenv.config();
    const value = process.env[key];
    if (!value) {
      throw new Error(`[module:env] ${key} does not exist`);
    }
    return this.parse(_Env.Schema[key], value);
  }
  static has(key) {
    return Boolean(this.get(key));
  }
};
var Env = _Env;
__name(Env, "Env");
__publicField(Env, "Schema", {
  PORT: z.string()
});

// app/core/ServerFactory.ts
import Hapi from "@hapi/hapi";
import mitt from "mitt";
var ServerFactory = class {
  // Hapi Server instance
  server;
  // Event Emitter that will be used to pass different events throughout server
  events;
  // stats of the server
  stats = {
    is_running: false
  };
  constructor() {
    this.server = Hapi.server({
      // get port from Environment Variables
      port: Env.get("PORT")
    });
    this.events = mitt();
  }
  /*
      start method is responsible for starting a server
      it first starts the server
      then changes the stats
      then the $onServerStart Event is triggered
  */
  async start() {
    await this.server.start();
    this.stats.is_running = true;
    return this;
  }
  async stop() {
    await this.server.stop();
    this.stats.is_running = false;
    return this;
  }
  addRoute(routerFactory) {
    const routerData = routerFactory(this.createRouterFactoryContext());
    return this.server.route(routerData);
  }
  createRouterFactoryContext() {
    return {
      factory: this,
      db
    };
  }
};
__name(ServerFactory, "ServerFactory");

// app/modules/getRouterFactory.ts
var Schema = {
  "/": await Promise.resolve().then(() => (init_routes(), routes_exports))
};
function getRouterFactory(path) {
  return Schema[path].factory;
}
__name(getRouterFactory, "getRouterFactory");

// app/index.ts
var Factory = new ServerFactory();
Factory.addRoute(getRouterFactory("/"));
Factory.start();
//# sourceMappingURL=index.js.map