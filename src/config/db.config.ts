import {EnvConfig} from "./env.config";

export class DBConfig {
    static HOST : string = EnvConfig.load("DB_HOST") as string;
    static USERNAME : string = EnvConfig.load("DB_USERNAME") as string;

    static PASSWORD : string = EnvConfig.load("DB_PASSWORD") as string;

    static PORT : number = EnvConfig.load("DB_PORT") as number;

    static INSTANCE_NAME : string = EnvConfig.load("DB_INSTANCE_NAME") as string;
}