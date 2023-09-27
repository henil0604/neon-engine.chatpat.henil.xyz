import { db } from "@/modules/Database.js";
import Env from "@/modules/Env.js";
import { RouterFactory, RouterFactoryContext } from "@/types/core.js";
import Hapi from "@hapi/hapi";

export interface ServerStats {
    is_running: boolean;
}

export default class ServerFactory {
    public server: Hapi.Server;
    public stats: ServerStats = {
        is_running: false
    };

    public constructor() {
        this.server = Hapi.server({
            port: Env.get("PORT")
        })
    }

    public async start() {
        await this.server.start();
        this.stats.is_running = true;
        this.$onServerStart?.()
        return this;
    }

    public async stop() {
        await this.server.stop();
        this.stats.is_running = false;
        this.$onServerStop?.();
        return this;
    }

    public addRoute(routerFactory: RouterFactory) {
        const routerData = routerFactory(this.createRouterFactoryContext())

        return this.server.route(routerData);
    }

    private createRouterFactoryContext(): RouterFactoryContext {
        return {
            factory: this,
            db: db
        }
    }

    public $onServerStart() {
        console.log(`Server is running on port ${this.server.info.port}`);
    }

    public $onServerStop() {
        console.log(`Server is no more running`);
    }


}