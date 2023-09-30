import { Socket } from "socket.io";

/**
 * This function is responsible for registering event handlers for individual sockets
 */
export async function SocketHandlerRegisterer(socket: Socket) {

}


/**
 * This function is responsible for initializing required event handlers for socket.io
 */
export const SocketHandlerInitializer = () => {
    // when a socket is connected
    Factory.io.on("connection", async (socket) => {

        console.log(`Socket connected: ${socket.id}`);

        await SocketHandlerRegisterer(socket);

    });
}