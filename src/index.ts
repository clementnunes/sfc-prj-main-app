// src/index.ts
import { FastifyConfig } from './config/fastify.config'
import { server } from './lib/fastify'
import { DbConn } from './dbConn'
import {basicRoutes} from "./lib/basic-routes";
import {usersRoutes} from "./lib/users-routes";
import {DbConnector} from "./lib/db-connector";
import {KafkaConfig} from "./config/kafka.config";
import {Kafka} from "kafkajs";
import fastifyKafkaJS from "fastify-kafkajs";


/*const kafka = new Kafka({
    clientId: KafkaConfig.KAFKA_APP_NAME,
    brokers: [KafkaConfig.KAFKA_BOOTSTRAP_SERVER]
})*/

async function run() {
    const dbConn = DbConn.getInstance();
    await dbConn._appDataSource.initialize()


    /*const producer = kafka.producer()

    await producer.connect()
    await producer.send({
        topic: KafkaConfig.KAFKA_TOPIC,
        messages: [
            { value: "test" }
        ]
    })

    await producer.disconnect()*/

    await server.register(DbConnector)
    await server.register(usersRoutes)
    await server.register(basicRoutes);

    await server.register(fastifyKafkaJS, {
        clientConfig: {
            brokers: [KafkaConfig.KAFKA_BOOTSTRAP_SERVER],
            clientId: KafkaConfig.KAFKA_APP_NAME
        },
        consumers: [
            {
                consumerConfig: {
                    groupId: 'example-consumer-group'
                },
                subscription: {
                    topics: ['test-topic'],
                    fromBeginning: false
                },
                runConfig: {
                    // eslint-disable-next-line @typescript-eslint/require-await
                    eachMessage: async ({ message }) => {
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        console.log(`Consumed message: ${message.value}`);
                    }
                }
            }
        ]
    });

    server.post('/produce', async (request) => {
        return server.kafka.producer.send({
            topic: KafkaConfig.KAFKA_TOPIC,
            messages: [{ key: 'key1', value: "3" }]
        });
    });

    await server.listen({ port: FastifyConfig.FASTIFY_PORT, host: FastifyConfig.FASTIFY_ADDR })
}

run().catch(console.error)
