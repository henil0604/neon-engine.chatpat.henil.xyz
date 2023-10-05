import RoomManager from "@/modules/RoomManager.js";
import { Socket } from "socket.io";

/**
 * This event handler is responsible for telling if given Room Exists or not by room name.
 */
export default function doesRoomExists(socket: Socket) {
    socket.on('room:doesExist?', async (name: string, ack) => {
        ack(await RoomManager.doesRoomExistsByName(name));
    })
}