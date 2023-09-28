import { db } from "@/modules/Database.js";
import Env from "@/modules/Env.js";
import { RouterFactory, RouterFactoryContext, ServerEvents } from "@/types/core.js";
import Hapi from "@hapi/hapi";
import Emittery from 'emittery';


/*
    ServerStats Interface is where all boolean/meta values will be stored
    eg. is_running, etc...
*/
export interface ServerStats {
    // shows if server is running or stopped
    is_running: boolean;
}

/*
    ServerFactory is factory class which will manage all
    the server related methods. The Factory is basically
    a way to bake the server
*/
export default class ServerFactory {
    // Hapi Server instance
    public server: Hapi.Server;

    // Event Emitter that will be used to pass different events throughout server
    public emitter: Emittery<ServerEvents>;

    // stats of the server
    public stats: ServerStats = {
        is_running: false
    };

    public constructor() {
        // Creating new instance of Hapi server
        this.server = Hapi.server({
            // get port from Environment Variables
            port: Env.get("PORT")
        })

        this.emitter = new Emittery();

    }

    /*
        start method is responsible for starting a server
        it first starts the server
        then changes the stats
        then the $onServerStart Event is triggered
    */
    public async start() {
        this.emitter.emit('before_start', void 0);
        // start hapi server
        await this.server.start();
        // set is_running as true in server stats
        this.stats.is_running = true;
        // emit 'start' event 
        this.emitter.emit('start', Date.now());
        return this;
    }

    public async stop() {
        this.emitter.emit('before_stop', void 0);
        // stop hapi server
        await this.server.stop();
        // set is_running as false in server stats
        this.stats.is_running = false;
        // emit 'stop' event 
        this.emitter.emit('stop', {
            reason: 'METHOD_CALLED',
            timestamp: Date.now()
        })
        return this;
    }

    public addRoute(routerFactory: RouterFactory) {
        // calls router factory that returns router data
        const routerData = routerFactory(this.createRouterFactoryContext());
        return this.server.route(routerData);
    }

    private createRouterFactoryContext(): RouterFactoryContext {
        return {
            factory: this,
            db: db
        }
    }

}