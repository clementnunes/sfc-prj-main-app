import {
    Length,
    Matches, MaxLength, MinLength
} from "class-validator";

import { validate } from "class-validator"

export class SetPasswordDTO {

    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_$&*()@#?!,|=+.:-])[A-Za-z\d_$&*()@#?!,|=+.:-]+/,
        {
            message: "Format de mot de passe incorrect, au moins une majuscule, une minuscule, " +
                "un chiffre et un caractère spécial (_ $ & * ( ) @ # ? ! , | = + . : -) sont attendus"
        })
    @MinLength(14, {message: "Password should have at least 14 characters"})
    @MaxLength(240, {message: "Password should have less than 240 characters"})
    private readonly password: string;

    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_$&*()@#?!,|=+.:-])[A-Za-z\d_$&*()@#?!,|=+.:-]+/,
        {
            message: "Format de mot de passe incorrect, au moins une majuscule, une minuscule, " +
                "un chiffre et un caractère spécial (_ $ & * ( ) @ # ? ! , | = + . : -) sont attendus"
        })
    @MinLength(14, {message: "Password should have at least 14 characters"})
    @MaxLength(240, {message: "Password should have less than 240 characters"})
    private readonly passwordConfirmation: string;

    constructor(password: string, passwordConfirmation: string) {
       this.password = password;
       this.passwordConfirmation = passwordConfirmation;
    }

    public getPassword() : string
    {
        return this.password;
    }

    public getPasswordConfirmation() : string
    {
        return this.passwordConfirmation;
    }

    public async validate()
    {
        const errors = await validate(this)
        if (errors.length) throw errors[0];
    }
}