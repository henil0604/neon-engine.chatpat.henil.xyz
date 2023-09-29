import { RouterFactory } from "@/types/core.js";

export const factory: RouterFactory = (ctx) => {
    // creating express GET request handler
    ctx.factory.app.get('/', (req, res) => {
        res.write("Hello World");
        res.end();
    })
}