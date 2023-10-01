import { RouterFactory } from "@/types/core.js";
import { parseCookie } from "lucia/utils";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { auth, githubAuth } from "@/modules/auth.js";
import { DEFAULT_REDIRECT_URL_AFTER_SUCCESSFUL_LOGIN } from "@/const.js";

export const factory: RouterFactory = (ctx) => {
    // creating express GET request handler
    ctx.factory.app.get('/auth/oauth/github/callback', async (req, res) => {

        // getting github_oauth_state from cookies
        // this helps validate if the user is really coming from github
        const storedState = req.cookies.github_oauth_state;

        // getting state from query params
        const state = req.query.state;
        // getting code from query params
        const code = req.query.code;
        // getting redirectTo from cookies
        const redirectTo = req.cookies.github_oauth_redirectTo;

        // validate state
        if (
            !storedState || // if there was no github_oauth_state
            !state || // if there is no state query param
            storedState !== state || // if github_oauth_state and state are not equal
            typeof code !== "string" // if code is not type of string
        ) {
            // this is bad request
            return res.sendStatus(400);
        }

        try {
            // checking if code is valid
            // if valid, we get function to get existing user, githubUser and function to create new user
            const { getExistingUser, githubUser, createUser } =
                await githubAuth.validateCallback(code);

            // a small user function that checks if the user already exists
            // if user is not found, it creates new user using user data that github provided
            const getUser = async () => {
                const existingUser = await getExistingUser();
                if (existingUser) return existingUser;
                const user = await createUser({
                    attributes: {
                        username: githubUser.login,
                        name: githubUser.name
                    }
                });
                return user;
            };

            const user = await getUser();
            // creates new session
            const session = await auth.createSession({
                userId: user.userId,
                attributes: {}
            });

            // create new authRequest
            const authRequest = auth.handleRequest(req, res);
            // setting session to auth request
            authRequest.setSession(session);
            return res.status(302).setHeader("Location", redirectTo || DEFAULT_REDIRECT_URL_AFTER_SUCCESSFUL_LOGIN).end();
        } catch (e) {
            console.error("error?", e);
            if (e instanceof OAuthRequestError) {
                // invalid code
                return res.sendStatus(400);
            }
            return res.sendStatus(500);
        }

    })
}