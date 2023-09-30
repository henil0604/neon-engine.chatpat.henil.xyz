import dotenv from 'dotenv';
import { z, ZodSchema } from 'zod';

/**
 * Env module is responsible for fetching environment variables
 * It also parses the result as per defined Zod Schema
 */
export default class Env {
    private constructor() { }

    private static parse<T extends ZodSchema<any>>(schema: T, value: string): ReturnType<T['parse']> {
        return schema.parse(value) as ReturnType<T['parse']>;
    }

    public static get<T extends keyof typeof Env.Schema>(key: T): ReturnType<typeof Env.Schema[T]['parse']> {
        dotenv.config();
        const value = process.env[key];

        if (!value) {
            throw new Error(`[module:env] ${key} does not exist`);
        }

        return this.parse(Env.Schema[key], value);
    }

    public static has(key: keyof typeof Env.Schema): boolean {
        return Boolean(this.get(key));
    }

    public static Schema = {
        PORT: z.string(),
        FRONT_HOST: z.string().url()
    } as const;
}
