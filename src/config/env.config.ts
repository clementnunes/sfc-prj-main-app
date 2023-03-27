import {ValidationError} from "class-validator";
import * as dotenv from 'dotenv'
dotenv.config();

export class EnvConfig {
    static load(propertyName: string) : string|number|boolean
    {
        return this.parse(propertyName);
    }

    static parse(propertyName: string) : string|number|boolean
    {
        this.validate(propertyName)

        const rawProperty = process.env[propertyName];

        if(rawProperty == undefined)
            throw new ValidationError()

        if(rawProperty === "true" || rawProperty === "false")
            return (rawProperty === "true");

        return (/^\d$/.test(rawProperty))
            ? Number(rawProperty)
            : rawProperty;
    }

    static validate(propertyName: string)
    {
        if(propertyName == undefined)
            throw new ValidationError()
    }
}