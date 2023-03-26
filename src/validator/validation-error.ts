import * as ClassValidator from "class-validator";

export class ValidationError  extends ClassValidator.ValidationError {
    private stack : string;
    private message : string;

    constructor(message: string, stack: string, target: object, property: string) {
        super()
        this.message = message;
        this.stack = stack;
        this.target = target;
        this.property = property;
    }
}