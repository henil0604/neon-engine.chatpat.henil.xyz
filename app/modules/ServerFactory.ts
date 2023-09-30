import { db } from "@/modules/Database.js";
import Env from "@/modules/Env.js";
import { RouterFactory, RouterFactoryContext, ServerEvents } from "@/types/core.js";
import Emittery from 'emittery';
import http from "http";
import express from "express";
import * as SocketIo from 'socket.io';

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
    // http app instance
    public server: http.Server;

    // express app instance
    public app: express.Express;

    // Event Emitter that will be used to pass different events throughout server
    public emitter: Emittery<ServerEvents>;

    // stats of the server
    public stats: ServerStats = {
        is_running: false
    };

    public io: SocketIo.Server;

    public constructor() {
        this.app = express();

        this.server = http.createServer(this.app);

        // creating socket.io server
        this.io = new SocketIo.Server(this.server, {
            // setting cors origin as * for testing
            cors: {
                // ! COMMENT THIS IN PRODUCTION
                origin: `*`
                // ! UNCOMMENT BELOW LINE IN PRODUCTION
                // origin: `${Env.get("FRONT_HOST")}`
            },
        });

        this.emitter = new Emittery();
    }

    /**
     * ? this method is currently empty as there is nothing to preprocess
     */
    public async preprocess() {
    }

    /*
        start method is responsible for starting a server
        it first starts the server
        then changes the stats
        then the start Event is triggered
    */
    public async start() {
        this.emitter.emit('before_start', void 0);
        // start hapi server
        this.server.listen(Env.get("PORT"));
        // set is_running as true in server stats
        this.stats.is_running = true;
        // emit 'start' event 
        this.emitter.emit('start', Date.now());
        return this;
    }

    public async stop() {
        this.emitter.emit('before_stop', void 0);
        // stop hapi server
        this.server.close();
        // set is_running as false in server stats
        this.stats.is_running = false;
        // emit 'stop' event 
        this.emitter.emit('stop', {
            reason: 'METHOD_CALLED',
            timestamp: Date.now()
        })
        return this;
    }

    /**
     * this method is responsible for calling routerFactory with the required context
     */
    public addRoute(routerFactory: RouterFactory) {
        return routerFactory(this.createRouterFactoryContext());
    }

    private createRouterFactoryContext(): RouterFactoryContext {
        return {
            factory: this,
            db: db
        }
    }

}