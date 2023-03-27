import {FastifyInstance, FastifyRequest} from "fastify";
import {UserController} from "../controllers/UserController";
import {User} from "../entities/user";
import * as CreateUserRequestBodySchema from "../json_schema/create-user-request-body.schema.json"
import {DbConn} from "../dbConn";

export function usersRoutes (fastify: FastifyInstance, options: object, done: any) {
    const dbConn = DbConn.getInstance();
    const userRepo = dbConn.appDataSource.getRepository(User)
    const userController = new UserController(userRepo);

    fastify.get('/', (request) => {
        return { hello: 'world' }
    })

    fastify.get('/users', () => userController.getCollection());

    fastify.get<{ Params: { id: string } }>('/users/:id', async (request) => await userController.get(request.params.id));

    const schema = {
        body: CreateUserRequestBodySchema,
    }

    fastify.post('/users', { schema }, async (request: FastifyRequest) => await userController.post(request));

    done();
}