import { RouterFactory } from "@/types/core.js";

export const factory: RouterFactory = (ctx) => {
    return {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello!';
        }
    }
}