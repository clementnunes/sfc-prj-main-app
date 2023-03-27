import {DataSource, DataSourceOptions} from "typeorm";
import {User} from "./entities/user";
import * as dotenv from 'dotenv'
import {KafkaConfig} from "./config/kafka.config";
import { Kafka } from "kafkajs"
dotenv.config()

export class KafkaJS {
    static INSTANCE : null|KafkaJS = null;
    readonly _kafka: Kafka;

    private constructor() {
        this._kafka = new Kafka({
            clientId: KafkaConfig.KAFKA_APP_NAME,
            brokers: [KafkaConfig.KAFKA_BOOTSTRAP_SERVER]
        })

    }

    static getInstance()
    {
        if(null == KafkaJS.INSTANCE)
            KafkaJS.INSTANCE = new KafkaJS();

        return KafkaJS.INSTANCE
    }

    get kafka(): Kafka
    {
        return this._kafka;
    }
}