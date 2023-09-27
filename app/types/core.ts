import ServerFactory from "@/core/ServerFactory.js";
import { db } from "@/modules/Database.js";
import { ServerRoute } from "@hapi/hapi";

export interface RouterFactoryContext {
    factory: ServerFactory
    db: typeof db
}

export type RouterFactory = (context: RouterFactoryContext) => ServerRoute