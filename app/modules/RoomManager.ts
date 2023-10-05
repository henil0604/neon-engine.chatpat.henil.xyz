import { db } from "@/modules/Database.js";

/**
 * This Class Module is responsible for having all the utility methods related to `Room`.
 * All the methods will be static and the constructor is private
 */
export default class RoomManager {

    private constructor() { }

    /**
     * This method is responsible for fetching the room by it's name
     */
    public static getRoomByName(name: string) {
        return db.room.findFirst({
            where: {
                name
            }
        }) || null;
    }

    /**
     * This method is responsible for checking if the room exists or not
     */
    public static async doesRoomExistsByName(name: string) {
        return await this.getRoomByName(name) ? true : false;
    }

}