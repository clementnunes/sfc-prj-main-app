import {FastifyInstance, FastifyRequest} from "fastify";
import {UserController} from "../controllers/UserController";
import {User} from "../entities/user";
import * as CreateUserRequestBodySchema from "../json_schema/create-user-request-body.schema.json"
import {DbConn} from "../dbConn";

export function basicRoutes (fastify: FastifyInstance, options: object, done: any) {
    fastify.get('/tests', async (request, reply) => {
        await reply.send({ hello: 'world' })
    })

    done();
}