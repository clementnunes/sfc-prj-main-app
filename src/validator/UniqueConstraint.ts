import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {Repository} from "typeorm";
import {User} from "../entities/user";
import {DbConn} from "../dbConn";
import {UserService} from "../services/user-service";

@ValidatorConstraint({async: true})
export class UniqueConstraint implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
        const userRepo: Repository<User> = DbConn.getInstance().appDataSource.getRepository(User)
        const userService = UserService.getInstance(userRepo);

        const user = await userService.findByEmail(value);

        return (user === null);
    }
}