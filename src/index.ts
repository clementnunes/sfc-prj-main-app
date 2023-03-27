// src/index.ts
import { FastifyConfig } from './config/fastify.config'
import { server } from './lib/fastify'
import { DbConn } from './dbConn'
import {basicRoutes} from "./lib/basic-routes";
import {usersRoutes} from "./lib/users-routes";
import {DbConnector} from "./lib/db-connector";
import {KafkaConfig} from "./config/kafka.config";

const fastifyKafka = require("@fastify/kafka")

/*const kafka = new Kafka({
    clientId: KafkaConfig.KAFKA_APP_NAME,
    brokers: [KafkaConfig.KAFKA_BOOTSTRAP_SERVER]
})*/

async function run() {
    const dbConn = DbConn.getInstance();
    await dbConn._appDataSource.initialize()

    await server
        .register(fastifyKafka, {
            producer: {
                'metadata.broker.list': '127.0.0.1:9092',
                'group.id': KafkaConfig.KAFKA_GROUP_NAME,
                'fetch.wait.max.ms': 10,
                'fetch.error.backoff.ms': 50,
                'dr_cb': true
            },
            consumer: {
                'metadata.broker.list': '127.0.0.1:9092',
                'group.id': KafkaConfig.KAFKA_GROUP_NAME,
                'fetch.wait.max.ms': 10,
                'fetch.error.backoff.ms': 50,
                'auto.offset.reset': 'earliest'
            }
        })

    await server.register(DbConnector)
    await server.register(usersRoutes)
    await server.register(basicRoutes);

    await server.listen({ port: FastifyConfig.FASTIFY_PORT, host: FastifyConfig.FASTIFY_ADDR })
}

run().catch(console.error)
