import {registerDecorator, ValidationOptions} from "class-validator";
import {UniqueConstraint} from "./UniqueConstraint";

export function Unique(validationOptions?: ValidationOptions)
{
    return function (object: object, propertyName: string)
    {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UniqueConstraint
        });
    };
}