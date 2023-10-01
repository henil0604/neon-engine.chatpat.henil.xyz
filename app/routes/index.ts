import { auth } from "@/modules/auth.js";
import { RouterFactory } from "@/types/core.js";

export const factory: RouterFactory = (ctx) => {
    // creating express GET request handler
    ctx.factory.app.get('/', async (req, res) => {
        const session = await auth.handleRequest(req, res).validate();

        if (!session) {
            res.redirect('/auth/oauth/github');
            res.end();
            return;
        }

        res.send(`Hello ${session.user.name || session.user.username}`);
    })
}