import {FastifyInstance, FastifyRequest} from "fastify";
import {UserController} from "../controllers/UserController";
import {User} from "../entities/user";
import * as CreateUserRequestBodySchema from "../json_schema/create-user-request-body.schema.json"
import {DbConn} from "../dbConn";
import {KafkaConfig} from "../config/kafka.config";
import {use} from "chai";
import { KafkaJS } from "../kafka"
import {Kafka} from "kafkajs";

const kafkaIns : KafkaJS = KafkaJS.getInstance()
const kafka : Kafka = kafkaIns.kafka

export function usersRoutes (fastify: FastifyInstance, options: object, done: any) {
    const dbConn = DbConn.getInstance();
    const userRepo = dbConn.appDataSource.getRepository(User)
    const userController = new UserController(userRepo);

    fastify.get('/', (request) => {
        return { hello: 'world' }
    })

    //fastify.get('/users', () => userController.getCollection());

    fastify.get<{ Params: { id: string } }>('/users/:id', async (request) => await userController.get(request.params.id));

    const schema = {
        body: CreateUserRequestBodySchema,
    }

    //fastify.post('/users', { schema }, async (request: FastifyRequest) => await userController.post(request));

    fastify.post('/users', { schema }, async (request: FastifyRequest) => {
        const userData : UserDTO = request.body as UserDTO;

        /*await kafkaIns.producer.send({
            topic: KafkaConfig.KAFKA_TOPIC,
            messages: [
                { value: JSON.stringify(userData) },
            ],
        })
         */
        await kafkaIns.consumer.subscribe({ topic: KafkaConfig.KAFKA_TOPIC, fromBeginning: true })

        await userController.post(request)
    });

    fastify.get('/users', { }, async (request: FastifyRequest) => {
        await kafkaIns.consumer.subscribe({ topic: KafkaConfig.KAFKA_TOPIC, fromBeginning: true })

        /*await kafkaIns.consumer.run({
            eachMessage: async ({ message }) => {
                if(null === message || null === message.value)
                    return;

                console.log({
                    value: message.value.toString(),
                })
            },
        })*/

        await userController.getCollection()
    });

    done();
}