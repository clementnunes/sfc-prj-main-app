import {KafkaConfig} from "./config/kafka.config";
import {Consumer, Kafka, logLevel, Partitioners, Producer} from "kafkajs";

export class KafkaJS {
    static INSTANCE : null|KafkaJS = null;
    readonly _kafka: Kafka;

    private _consumer: undefined|Consumer;

    private _producer: undefined|Producer;

    static IS_INITIALIZED = false;

    private constructor() {
        this._kafka = new Kafka({
            clientId: KafkaConfig.KAFKA_GROUP_NAME,
            brokers: [KafkaConfig.KAFKA_BOOTSTRAP_SERVER],
            logLevel: logLevel.WARN,
            ssl: false
        })
    }

    public async init()
    {
        if(KafkaJS.IS_INITIALIZED)
            return;

        this._consumer = this._kafka.consumer({ groupId: KafkaConfig.KAFKA_GROUP_NAME })
        await this._consumer.connect();

        this._producer = this._kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner })
        await this._producer.connect();

        KafkaJS.IS_INITIALIZED = true;
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

    get consumer(): Consumer
    {
        return (this._consumer as Consumer);
    }

    get producer(): Producer
    {
        return (this._producer as Producer);
    }
}