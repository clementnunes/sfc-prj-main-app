import {EnvConfig} from "./env.config";

export class SecurityConfig {
    static BCRYPT_SALT_SIZE : number = (EnvConfig.load("BCRYPT_SALT_SIZE") as number);

    static MIN_ENTROPY : number = EnvConfig.load("MIN_ENTROPY") as number;
}