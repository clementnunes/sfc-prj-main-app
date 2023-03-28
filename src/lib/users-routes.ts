import {FastifyInstance, FastifyRequest} from "fastify";
import {UserController} from "../controllers/UserController";
import {User} from "../entities/user";
import * as CreateUserRequestBodySchema from "../json_schema/create-user-request-body.schema.json"
import {DbConn} from "../dbConn";
import {KafkaConfig} from "../config/kafka.config";
import {KafkaJS} from "../kafka"
import {UserService} from "../services/user-service";
import {RecordMetadata} from "kafkajs";

export function usersRoutes(fastify: FastifyInstance, options: object, done: any)
{
    const kafkaIns: KafkaJS = KafkaJS.getInstance()
    const dbConn = DbConn.getInstance();
    const userRepo = dbConn.appDataSource.getRepository(User)
    const userController = new UserController(userRepo);
    const userService: UserService = UserService.getInstance(userRepo)

    fastify.get('/', (request) => {
        return {hello: 'world'}
    })

    //fastify.get('/users', () => userController.getCollection());

    fastify.get<{ Params: { id: string } }>('/users/:id', async (request) => await userController.get(request.params.id));

    const schema = {
        body: CreateUserRequestBodySchema,
    }

    fastify.post('/users', {schema}, async (request: FastifyRequest) => await userController.post(request));

    /*fastify.post('/users', { schema }, async (request: FastifyRequest) => {
        const userData : UserDTO = request.body as UserDTO;

        if(KafkaConfig.KAFKA_USAGE) {
            await kafkaIns.producer.send({
                topic: KafkaConfig.KAFKA_TOPIC,
                messages: [
                    {value: JSON.stringify(userData)},
                ],
            })
        }
        else {
            await userController.post(request)
        }
    });*/

    /*fastify.post('/users', { schema }, async (request: FastifyRequest) => {
        if(KafkaConfig.KAFKA_USAGE) {
            await kafkaIns.consumer.subscribe({topic: KafkaConfig.KAFKA_TOPIC, fromBeginning: true})

            return await kafkaIns.consumer.run({
                eachMessage: async ({message}) => {
                    if (null === message || null === message.value)
                        return;

                    console.log({
                        value: message.value.toString(),
                    })
                },
            })
        }
        else {
            await userController.post(request)
        }
    });*/

    /*fastify.get('/users', { }, async (request: FastifyRequest) => {
        if(KafkaConfig.KAFKA_USAGE) {
            await kafkaIns.consumer.subscribe({topic: KafkaConfig.KAFKA_TOPIC, fromBeginning: true})

            await kafkaIns.consumer.run({
                eachMessage: async ({message}) => {
                    if (null === message || null === message.value)
                        return;

                    console.log({
                        value: message.value.toString(),
                    })
                },
            })
        }
        else {
            await userController.getCollection()
        }
    });*/

    fastify.get('/users', {},
        async (request: FastifyRequest) => await userController.getCollection()
    );

    fastify.get('/users/consume', {}, async (request: FastifyRequest) => {
        if (KafkaConfig.KAFKA_USAGE) {
            await kafkaIns.consumer.subscribe({topic: KafkaConfig.KAFKA_TOPIC, fromBeginning: true})

            return await kafkaIns.consumer.run({
                eachMessage: async ({message}) => {
                    if (null === message || null === message.value)
                        return;

                    console.log({
                        value: message.value.toString(),
                    })
                },
            })
        }
    });


    fastify.get('/users/produce', {}, async (request: FastifyRequest) => {
        const users = await userService.findAll();

        if (KafkaConfig.KAFKA_USAGE) {
            const promise : RecordMetadata[] = await kafkaIns.producer.send({
                topic: KafkaConfig.KAFKA_TOPIC,
                messages: [
                    {value: JSON.stringify(users)}
                ]
            })

            await kafkaIns.producer.disconnect()

            return promise;
        } else {
            return await userController.getCollection()
        }
    });

    done();
}