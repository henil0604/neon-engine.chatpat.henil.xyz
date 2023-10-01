import { prisma } from "@lucia-auth/adapter-prisma";
import { lucia } from "lucia";
import { express } from "lucia/middleware";
import { db } from "@/modules/Database.js";
import "lucia/polyfill/node";
import Env from "@/modules/Env.js";
import { github } from '@lucia-auth/oauth/providers'

export const auth = lucia({
    adapter: prisma(db, {
        key: 'userKey',
        session: 'userSession',
        user: 'user'
    }),
    env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
    middleware: express(),
    getUserAttributes(databaseUser) {
        return {
            username: databaseUser.username,
            name: databaseUser.name
        }
    },
});

export const githubAuth = github(auth, {
    clientId: Env.get("GITHUB_CLIENT_ID") ?? "",
    clientSecret: Env.get("GITHUB_CLIENT_SECRET") ?? ""
});


export type Auth = typeof auth;