// src/index.ts
import { FastifyConfig } from './config/fastify.config'
import { server } from './lib/fastify'
import { DbConn } from './dbConn'
import {basicRoutes} from "./lib/basic-routes";
import {usersRoutes} from "./lib/users-routes";
import {DbConnector} from "./lib/db-connector";
import {KafkaJS} from "./kafka";
import {KafkaConfig} from "./config/kafka.config";

async function run() {
    const dbConn = DbConn.getInstance();
    await dbConn._appDataSource.initialize()

    const kafkaIns: KafkaJS = KafkaJS.getInstance()
    await kafkaIns.init();

    await kafkaIns.consumer.subscribe({topic: KafkaConfig.KAFKA_TOPIC, fromBeginning: false})

    /*await kafkaIns._kafka.admin().alterPartitionReassignments({
        topics: [
            {
                topic: KafkaConfig.KAFKA_TOPIC,
                partitionAssignment: [{
                    partition: 0,
                    replicas: [0, 1]
                }]
            }
        ]
    })*/

    /*await kafkaIns._kafka.admin().createTopics({
        waitForLeaders: true,
        topics: [
            {
                topic: KafkaConfig.KAFKA_TOPIC,
                numPartitions: 1,
                replicationFactor: 1
            }
        ]
    })

    await kafkaIns._kafka.admin().createPartitions({
        topicPartitions: [{ topic: KafkaConfig.KAFKA_TOPIC, count: 1}],
    })*/

    await server.register(DbConnector)
    await server.register(usersRoutes)
    await server.register(basicRoutes);

    await server.listen({ port: FastifyConfig.FASTIFY_PORT, host: FastifyConfig.FASTIFY_ADDR })
}

run().catch(console.error)
