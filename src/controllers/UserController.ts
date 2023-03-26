import {FastifyRequest} from "fastify";
import {SetPasswordDTO} from "../entities/dto/SetPasswordDTO";
import {User} from "../entities/user";
import {UserService} from "../services/user-service";
import {Repository} from "typeorm";

export class UserController implements IController {
    private readonly userService: UserService;

    constructor(userRepository: Repository<User>) {
        this.userService = UserService.getInstance(userRepository)
    }

    get(id: string)
    {
        console.log("id = ", id)
        return this.userService.findById(id);
    }

    getCollection()
    {
        return this.userService.findAll();
    }

    async post(request: FastifyRequest)
    {
        console.log("UserController:Post")

        const userData : UserDTO = request.body as UserDTO;
        console.log("request params = ", request.body)

        const pwd = new SetPasswordDTO(userData.password, userData.confirmPassword);

        const user : User = await this.userService.add(
            userData.firstName,
            userData.lastName,
            userData.email,
            pwd
        )

        await this.userService.persist(user);
    }
}