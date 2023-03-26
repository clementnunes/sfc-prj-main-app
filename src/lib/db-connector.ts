import fastifyPlugin from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres'
import {FastifyInstance} from "fastify";
import {DBConfig} from "../config/db.config";

export async function DbConnector (fastify: FastifyInstance, options: object) {
    await fastify.register(fastifyPostgres, {
        url: `postgres://${DBConfig.HOST}:${DBConfig.PORT}/${DBConfig.INSTANCE_NAME}`
    })
}