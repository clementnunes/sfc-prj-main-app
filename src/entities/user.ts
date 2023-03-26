import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from "typeorm"
import * as bcrypt from "bcrypt"
import * as dotenv from 'dotenv'
import {
    IsNotEmpty,
    Length, validate
} from "class-validator";
import {Unique} from "../validator/unique";
import {ValidationError} from "../validator/validation-error";
import {SecurityConfig} from "../config/security.config";

dotenv.config()

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid", { name: "id" })
    private _id!: string;

    @Column({ name: "firstName", nullable: false })
    @IsNotEmpty({
        message: "firstName should not be empty"
    })
    private _firstName!: string;

    @Column({ name: "lastName", nullable: false })
    @IsNotEmpty({
        message: "lastName should not be empty"
    })
    private _lastName!: string;

    @Column({
        nullable: false,
        unique: true,
        name: "email",
        transformer: {
            to(value : unknown) {
                return (typeof value === "string") ? (value ).toLowerCase() : value;
            },
            from(value : unknown) {
                return (typeof value === "string") ? (value ) : value;
            }
        },
    })
    @IsNotEmpty({
        message: "email should not be empty"
    })
    @Unique({message: "email already exists"})
    private _email!: string;

    @Column({ name: "password", nullable: false })
    @IsNotEmpty({
        message: "password should not be empty"
    })
    private _passwordHash!: string;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get passwordHash(): string {
        return this._passwordHash;
    }

    set passwordHash(value: string) {
        this._passwordHash = value;
    }
    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }
    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }
    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    public async setPassword(password: string, passwordConfirmation: string)
    {
        if(password != passwordConfirmation)
        {
            throw new ValidationError(
                "Different passwords given",
                (new Error).stack ?? "",
                this,
                "password"
            );
        }

        this._passwordHash = password;

        await this.hashPassword();
    }

    private async hashPassword()
    {
        const salt = await bcrypt.genSalt(Number(SecurityConfig.BCRYPT_SALT_SIZE));
        this._passwordHash = await bcrypt.hash(this._passwordHash, salt)
    }

    @BeforeInsert()
    @BeforeUpdate()
    public async validate()
    {
        const errors = await validate(this)

        if (errors.length)
        {
            throw errors[0];
        }
    }

    public async isPasswordValid(password: string)
    {
        return await bcrypt.compare(password, this._passwordHash);
    }
}