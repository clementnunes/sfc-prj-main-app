import {FastifyInstance, FastifyRequest} from "fastify";
import {UserController} from "../controllers/UserController";
import {User} from "../entities/user";
import * as CreateUserRequestBodySchema from "../json_schema/create-user-request-body.schema.json"
import {DbConn} from "../dbConn";
import {KafkaJS} from "../kafka";
import {KafkaConfig} from "../config/kafka.config";
import {use} from "chai";

const kafka = KafkaJS.getInstance().kafka

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

    fastify.post('/users', { schema }, async (request: FastifyRequest) => {
        const producer = kafka.producer()

        await producer.connect()

        const userData : UserDTO = request.body as UserDTO;

        await producer.send({
            topic: KafkaConfig.KAFKA_TOPIC,
            messages: [
                { value: JSON.stringify(userData) },
            ],
        })

        await userController.post(request)

        await producer.disconnect()
    });

    fastify.get('/users', { schema }, async (request: FastifyRequest) => {
        const consumer = kafka.consumer({ groupId: KafkaConfig.KAFKA_GROUP_NAME })

        await consumer.connect()
        await consumer.subscribe({ topic: KafkaConfig.KAFKA_TOPIC, fromBeginning: true })

        await consumer.run({
            eachMessage: async ({ message }) => {
                if(null === message || null === message.value)
                    return;

                console.log({
                    value: message.value.toString(),
                })
            },
        })

        await userController.getCollection()
    });

    done();
}