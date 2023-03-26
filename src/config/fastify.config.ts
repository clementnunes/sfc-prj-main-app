import {EnvConfig} from "./env.config";

export class FastifyConfig {
    static FASTIFY_ADDR : string = EnvConfig.load("FASTIFY_ADDR") as string;
    static FASTIFY_PORT : number = EnvConfig.load("FASTIFY_PORT") as number;
}