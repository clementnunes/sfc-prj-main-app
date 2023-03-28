import {FastifyInstance, FastifyRequest} from "fastify";
import {UserController} from "../controllers/UserController";
import {User} from "../entities/user";
import * as CreateUserRequestBodySchema from "../json_schema/create-user-request-body.schema.json"
import {DbConn} from "../dbConn";
import {KafkaConfig} from "../config/kafka.config";
import {KafkaJS} from "../kafka"
import {UserService} from "../services/user-service";
import {SetPasswordDTO} from "../entities/dto/SetPasswordDTO";

export function usersRoutes(fastify: FastifyInstance, options: object, done: any) {
    const kafkaIns: KafkaJS = KafkaJS.getInstance()
    const dbConn = DbConn.getInstance();
    const userRepo = dbConn.appDataSource.getRepository(User)
    const userController = new UserController(userRepo);
    const userService: UserService = UserService.getInstance(userRepo)

    fastify.get('/', (request) => {
        return {hello: 'world'}
    })

    fastify.get<{ Params: { id: string } }>('/users/:id', async (request) => await userController.get(request.params.id));

    const schema = {
        body: CreateUserRequestBodySchema,
    }

    fastify.post('/users', {schema}, async (request: FastifyRequest) => await userController.post(request));

    fastify.get('/users', {},
        async (request: FastifyRequest) => await userController.getCollection()
    );

    fastify.get('/consume-users', {}, async (request: FastifyRequest) => {
        await kafkaIns.consumer.run({
            eachMessage: async ({message}) => {
                if (null === message || null === message.value)
                    return;

                console.log({
                    value: message.value.toString(),
                })
            },
        });
    });

    fastify.get('/consume-users-add', {}, async (request) => {
        await kafkaIns.consumer.run({
            eachMessage: async ({message}) => {
                if (null === message || null === message.value)
                    return;

                const userData: UserDTO = message.value as unknown as UserDTO;

                await userService.addAndPersist(
                    userData.firstName,
                    userData.lastName,
                    userData.email,
                    new SetPasswordDTO(userData.password, userData.confirmPassword)
                )

                console.log({
                    value: message.value.toString(),
                })
            },
        });
    });

    fastify.get<{ Params: { id: string } }>('/produce-users/:id', {}, async (request) => {
        const user = await userService.findById(request.params.id);

        return await kafkaIns.producer.send({
            topic: KafkaConfig.KAFKA_TOPIC,
            messages: [
                {value: JSON.stringify(user)}
            ]
        });
    });

    fastify.get('/produce-users', {}, async (request: FastifyRequest) => {
        const users = await userService.findAll();

        return await kafkaIns.producer.send({
            topic: KafkaConfig.KAFKA_TOPIC,
            messages: [
                {value: JSON.stringify(users)}
            ]
        });
    });

    done();
}