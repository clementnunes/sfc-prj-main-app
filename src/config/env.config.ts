import {ValidationError} from "class-validator";
import * as dotenv from 'dotenv'
dotenv.config();

export class EnvConfig {
    static load(propertyName: string) : string|number
    {
        return this.parse(propertyName);
    }

    static parse(propertyName: string) : string|number
    {
        this.validate(propertyName)

        const rawProperty = process.env[propertyName];

        if(rawProperty == undefined)
            throw new ValidationError()

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