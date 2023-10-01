/// <reference types="@types/qs" />
/// <reference types="@types/express-serve-static-core" />
/// <reference types="lucia" />

import ServerFactory from "@/modules/ServerFactory.ts";

declare global {
    var Factory: ServerFactory;

    declare namespace Lucia {
        type Auth = import("@/modules/auth.js").Auth;
        type DatabaseUserAttributes = {
            username: string;
            name: string | null
        };
        type DatabaseSessionAttributes = {};
    }

    namespace Express {
        export interface Request {
            authRequest: ReturnType<Lucia.Auth["handleRequest"]>
            session: Awaited<ReturnType<Request["authRequest"]["validate"]>>
        }
    }
}


// to make the file a module and avoid the TypeScript error
export { }