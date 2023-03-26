import {Repository} from "typeorm";
import {User} from "../entities/user";
import {SetPasswordDTO} from "../entities/dto/SetPasswordDTO";
import {validate} from "class-validator";

interface FindWhereUser {
    id: string
}

export class UserService {
    static INSTANCE : null|UserService = null;
    private userRepository: Repository<User>;

    private constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository
    }

    static getInstance(userRepository: Repository<User>)
    {
        if(null == UserService.INSTANCE)
            UserService.INSTANCE = new UserService(userRepository);

        return UserService.INSTANCE
    }

    async add(firstName: string, lastName: string, email: string, setPassword: SetPasswordDTO)
    {
        const user = this.userRepository.create();

        user.firstName = firstName
        user.lastName = lastName
        user.email = email

        await setPassword.validate();

        await user.setPassword(setPassword.getPassword(), setPassword.getPasswordConfirmation());

        return user
    }

    async persist(user: User)
    {
        //await user.validate();
        await this.userRepository.save(user)
    }

    async addAndPersist(firstName: string, lastName: string, email: string, setPassword: SetPasswordDTO)
    {
        const user = await this.add(firstName, lastName, email, setPassword)
        await this.persist(user)
        return user
    }

    async findAll()
    {
        return this.userRepository.createQueryBuilder("user").getMany();
    }

    findById(id: string)
    {
        return this.userRepository.findOneBy({
            "_id": id
        } as unknown as FindWhereUser)
    }

    count()
    {
        return this.userRepository.createQueryBuilder("user").getCount();
    }

    countByEmail(email: string)
    {
        return this.userRepository.createQueryBuilder("user").where("user.email = :email", { email: email.toLowerCase()}).getCount();
    }

    findByEmail(email: string)
    {
        return this.userRepository.createQueryBuilder("user").where("user.email = :email", { email: email.toLowerCase()}).getOne();
    }

    getFirst()
    {
        return this.userRepository.createQueryBuilder("user").getOne();
    }
}