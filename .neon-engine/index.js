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

// app/routes/stop.ts
var stop_exports = {};
__export(stop_exports, {
  factory: () => factory2
});
var factory2;
var init_stop = __esm({
  "app/routes/stop.ts"() {
    "use strict";
    factory2 = /* @__PURE__ */ __name((ctx) => {
      return {
        method: "GET",
        path: "/stop",
        handler: (request, h) => {
          ctx.factory.stop();
          return "Stopped!";
        }
      };
    }, "factory");
  }
});

// app/modules/Database.ts
import { PrismaClient } from "@prisma/client";
var globalForPrisma = globalThis;
var isDev = process.env.NODE_ENV === "development";
var db = globalForPrisma.prisma ?? new PrismaClient({
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
  PORT: z.string(),
  USERNAME: z.string()
  // Add more keys and their corresponding Zod types here
});

// app/core/ServerFactory.ts
import Hapi from "@hapi/hapi";
var ServerFactory = class {
  server;
  stats = {
    is_running: false
  };
  constructor() {
    this.server = Hapi.server({
      port: Env.get("PORT")
    });
  }
  async start() {
    await this.server.start();
    this.stats.is_running = true;
    this.$onServerStart?.();
    return this;
  }
  async stop() {
    await this.server.stop();
    this.stats.is_running = false;
    this.$onServerStop?.();
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
  $onServerStart() {
    console.log(`Server is running on port ${this.server.info.port}`);
  }
  $onServerStop() {
    console.log(`Server is no more running`);
  }
};
__name(ServerFactory, "ServerFactory");

// app/modules/getRouterFactory.ts
var Schema = {
  "/": await Promise.resolve().then(() => (init_routes(), routes_exports)),
  "/stop": await Promise.resolve().then(() => (init_stop(), stop_exports))
};
function getRouterFactory(path) {
  return Schema[path].factory;
}
__name(getRouterFactory, "getRouterFactory");

// app/index.ts
var Factory = new ServerFactory();
Factory.start();
Factory.addRoute(getRouterFactory("/"));
Factory.addRoute(getRouterFactory("/stop"));
//# sourceMappingURL=index.js.map