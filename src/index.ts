// src/index.ts
import { FastifyConfig } from './config/fastify.config'
import { server } from './lib/fastify'
import { DbConn } from './dbConn'
import {basicRoutes} from "./lib/basic-routes";
import {usersRoutes} from "./lib/users-routes";
import {DbConnector} from "./lib/db-connector";
import {KafkaConfig} from "./config/kafka.config";
import {Kafka} from "kafkajs";


const kafka = new Kafka({
    clientId: KafkaConfig.KAFKA_APP_NAME,
    brokers: [KafkaConfig.KAFKA_BOOTSTRAP_SERVER]
})

async function run() {
    const dbConn = DbConn.getInstance();
    await dbConn._appDataSource.initialize()

    const producer = kafka.producer()

    await producer.connect()
    await producer.send({
        topic: KafkaConfig.KAFKA_TOPIC,
        messages: [
            { value: "test" }
        ]
    })

    await server.register(DbConnector)
    await server.register(usersRoutes)
    await server.register(basicRoutes);

    await server.listen({ port: FastifyConfig.FASTIFY_PORT, host: FastifyConfig.FASTIFY_ADDR })
}

run().catch(console.error)
