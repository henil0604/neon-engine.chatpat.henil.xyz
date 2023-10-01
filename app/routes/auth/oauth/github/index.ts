import { githubAuth } from "@/modules/auth.js";
import getRouterFactory from "@/modules/getRouterFactory.js";
import { RouterFactory } from "@/types/core.js";

export const factory: RouterFactory = (ctx) => {
    ctx.factory.app.get('/auth/oauth/github', async (req, res) => {
        // getting auth url and state from github
        const [url, state] = await githubAuth.getAuthorizationUrl();
        // getting redirectTo from query
        const redirectTo = req.query.redirectTo;

        // settings state as cookie
        res.cookie("github_oauth_state", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60
        });

        // if redirectTo is provided, set a cookie
        if (redirectTo) {
            res.cookie("github_oauth_redirectTo", redirectTo, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60
            });
        }
        return res.status(302).setHeader("Location", url.toString()).end();
    })
}