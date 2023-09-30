import ServerFactory from "@/modules/ServerFactory.js";
import { db } from "@/modules/Database.js";

export interface RouterFactoryContext {
    factory: ServerFactory
    db: typeof db
}

export type RouterFactory = (context: RouterFactoryContext) => any

export type ServerEvents = {
    before_start: void
    start: number
    before_stop: void
    stop: {
        reason: 'METHOD_CALLED',
        timestamp: number
    }
}