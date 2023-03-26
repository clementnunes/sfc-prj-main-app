// src/index.ts
import { FastifyConfig } from './config/fastify.config'
import { server } from './lib/fastify'
import { DbConn } from './dbConn'
import {basicRoutes} from "./lib/basic-routes";
import {usersRoutes} from "./lib/users-routes";
import {DbConnector} from "./lib/db-connector";

async function run() {
    const dbConn = DbConn.getInstance();
    await dbConn._appDataSource.initialize()

    await server.register(DbConnector)
    await server.register(usersRoutes)
    await server.register(basicRoutes);

    await server.listen({ port: FastifyConfig.FASTIFY_PORT, host: FastifyConfig.FASTIFY_ADDR })
}

run().catch(console.error)