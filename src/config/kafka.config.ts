import {EnvConfig} from "./env.config";

export class KafkaConfig {
    static KAFKA_BOOTSTRAP_SERVER : string = EnvConfig.load("APP_KAFKA_BOOTSTRAP_SERVER") as string;
    static KAFKA_TOPIC : string = EnvConfig.load("APP_KAFKA_TOPIC") as string;

    static KAFKA_APP_NAME : string = EnvConfig.load("KAFKA_APP_NAME") as string;

    static KAFKA_GROUP_NAME : string = EnvConfig.load("KAFKA_GROUP_NAME") as string;
}