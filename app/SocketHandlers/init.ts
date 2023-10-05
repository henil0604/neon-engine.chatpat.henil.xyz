import { Socket } from "socket.io";
import doesRoomExists from "@/SocketHandlers/doesRoomExists.js";
import { auth } from "@/modules/auth.js";
import { LuciaError } from "lucia";

/**
 * This function is responsible for registering event handlers for individual sockets
 */
export async function SocketHandlerRegisterer(socket: Socket) {
    doesRoomExists(socket);
}

/**
 * This function is called via the `io` middleware, it is responsible for
 * checking if socket has `auth_session` token in `auth` object of `handshake` object.
 * if it doesn't find any, it will disconnect the connection.
 * if it finds it, it will validate it using `auth.validateSession` method
 * if the session is not valid, forced disconnection will be triggered
 * if session is valid, it will just return true.
 */
async function initialAuthChecker(socket: Socket) {
    // extract `auth_session`
    const auth_session = socket.handshake.auth.auth_session;
    // if `auth_session` is not there
    if (!auth_session) {
        // force disconnect
        socket.disconnect(true);
        return false;
    }

    console.log(`Auth session received: ${auth_session}`);
    // initialize `session` object as null
    socket.handshake.auth.session = null;

    // will use try catch here to catch error of `auth.validateSession` method. it throws `LuciaError`
    try {
        // fetch session
        const session = await auth.validateSession(auth_session)
        // set session
        socket.handshake.auth.session = session;
        return true;
    } catch (e) {
        if (e instanceof LuciaError) {
            // force disconnect
            socket.disconnect(true);
            return false;
        }
    }
    return true;
}


/**
 * This function is responsible for initializing required event handlers for socket.io
 */
export const SocketHandlerInitializer = () => {

    /**
     * This middleware is called whenever a new socket is connected or
     * old socket is reconnected 
     */
    Factory.io.use((socket, next) => {
        console.log(`Socket connected: ${socket.id}`);

        // calling initialAuthChecker to check for authorization
        initialAuthChecker(socket);

        // calling next middleware
        next();
    });

    // when a socket is connected
    Factory.io.on("connection", async (socket) => {

        /**
         * This middleware is called whenever a event is emitted by client.
         * the function is responsible for checking if `session` exist on socket
         */
        socket.use((event, next) => {
            // if there is no `session` do not do anything
            if (!socket.handshake.auth.session) {
                return next(new Error("UNAUTHORIZED"));
            }
            next();
        })

        // register socket handlers
        await SocketHandlerRegisterer(socket);

    });
}