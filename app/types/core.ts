import ServerFactory from "@/core/ServerFactory.js";
import { db } from "@/modules/Database.js";
import { ServerRoute } from "@hapi/hapi";

export interface RouterFactoryContext {
    factory: ServerFactory
    db: typeof db
}

export type RouterFactory = (context: RouterFactoryContext) => ServerRoute

export type ServerEvents = {
    before_start: void
    start: number
    before_stop: void
    stop: {
        reason: 'METHOD_CALLED',
        timestamp: number
    }
}