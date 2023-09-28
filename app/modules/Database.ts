import { PrismaClient } from "@prisma/client";

// creates new global that also includes prisma object as extra property 
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// checks if the server is running on development mode or not
const isDev = process.env.NODE_ENV === 'development'

// creates db object
export const db =
    globalForPrisma.prisma ?? // if the global object already has prisma, use it
    new PrismaClient({
        log:
            isDev ? ["query", "error", "warn"] : ["error"],
    });

// if the server is in development mode, set a global prisma object
if (isDev) globalForPrisma.prisma = db;