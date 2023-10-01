import { DEFAULT_REDIRECT_URL_AFTER_SUCCESSFUL_LOGOUT } from "@/const.js";
import { auth } from "@/modules/auth.js";
import getRouterFactory from "@/modules/getRouterFactory.js";
import { RouterFactory } from "@/types/core.js";

export const factory: RouterFactory = (ctx) => {
    ctx.factory.app.get('/auth/logout', async (req, res) => {
        // create new authRequest
        const authRequest = auth.handleRequest(req, res);
        // validating session
        const session = await authRequest.validate();
        // if invalid session
        if (!session) {
            // send 401
            return res.sendStatus(401);
        }
        // invalidate session
        await auth.invalidateSession(session.sessionId);
        // set session to null
        authRequest.setSession(null);
        // redirect
        return res.status(302).setHeader("Location", (req.query.redirectTo || DEFAULT_REDIRECT_URL_AFTER_SUCCESSFUL_LOGOUT).toString()).end();
    })
}