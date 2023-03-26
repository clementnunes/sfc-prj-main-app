import Fastify, {FastifyRequest} from 'fastify'
import { DbConnector } from "./db-connector"
import { usersRoutes } from "./users-routes"
import {DbConn} from "../dbConn";
import {basicRoutes} from "./basic-routes";
import * as CreateUserRequestBodySchema from "../json_schema/create-user-request-body.schema.json";
import {User} from "../entities/user";
import {UserController} from "../controllers/UserController";

export const server = Fastify({
    logger: true,
    pluginTimeout: 20000
})

interface Params {
    id: string
}

/**
 * Run the server!
 */

void server.register((app, _, done) => {
    const dbConn = DbConn.getInstance();
    const userRepo = dbConn.appDataSource.getRepository(User)
    const userController = new UserController(userRepo);

    /*app.get('/users', () => userController.getCollection());

    app.get<{ Params: { id: string } }>('/users/:id', (request) => userController.get(request.params.id));

    app.get('/tests', async (request, reply) => {
        await reply.send({ hello: 'world' })
    })

    const schema = {
        body: CreateUserRequestBodySchema,
    }

    app.route({
        method: "GET",
        url: '/users',
        handler: () => userController.getCollection()
    });

    app.route({
        method: "GET",
        url: '/users/:id',
        handler: (request: FastifyRequest) => {
            const params = request.params as Params;

            if(!params.hasOwnProperty("id"))
            {
                return null;
            }

            const id : string = params.id;
            return userController.get(id);
        }
    });

    app.route({
        method: "POST",
        url: '/users',
        schema: schema,
        handler: async (request: FastifyRequest) => await userController.post(request)
    });

    app.route({
        method: "GET",
        url: "/two",
        handler: () => "two"
    });
    */
    done();
});

/*const start = async () => {
    const dbConn = DbConn.getInstance();
    await dbConn.initialize()

    await server.register(DbConnector)
    await server.register(usersRoutes)
    await server.register(basicRoutes);

    try
    {
        await server.listen({ port: 3000 })
    }
    catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()
    .catch(error => {
        console.log(error)
    })
*/