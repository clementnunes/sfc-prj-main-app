import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {User} from '../entities/user'
import {DbConn} from "../dbConn";
import {expect} from 'chai';
import Throw = Chai.Throw;
import {QueryFailedError, Repository} from "typeorm";
import {UserService} from "../services/user-service"
import {ValidationError} from "../validator/validation-error";
import {SetPasswordDTO} from "../entities/dto/SetPasswordDTO";
import {faker} from "@faker-js/faker";

const dbConn = DbConn.getInstance();
const userService = UserService.getInstance(dbConn.appDataSource.getRepository(User))

chai.use(chaiAsPromised)

describe('User', function () {
    before(async function () {
        await dbConn.initialize()
    })

    beforeEach(async function () {
        const userRepo = dbConn.appDataSource.getRepository(User)
        console.log("Clearing user table")
        await userRepo.clear()
    })

    describe('validations', function () {
        const userRepo: Repository<User> = dbConn.appDataSource.getRepository(User)

        it('should create a new User in database', async () => {
            let count: number = await userRepo.count()
            expect(count).to.equal(0)

            const password = faker.internet.password() + ".132";
            const email = faker.internet.email();

            await userService.addAndPersist(
                faker.name.firstName(),
                faker.name.lastName(),
                email,
                new SetPasswordDTO(password, password)
            ).then((e) => {
                expect(e).not.to.equal(null)
            })
            .catch((e) => {
                throw e;
            })
        })

        it('should raise error if email is missing', async function () {

            const password = faker.internet.password() + ".132";

            const user: User = await userService.add(
                faker.name.firstName(),
                faker.name.lastName(),
                "",
                new SetPasswordDTO(password, password)
            );

            await expect(userService.persist(user)).to.eventually.be.rejected.and.deep.include({
                target: user,
                property: '_email',
                constraints: {isNotEmpty: 'email should not be empty'}
            })
        })

        it('should raise error if email duplication', async function () {
            const password = faker.internet.password() + ".132";
            const email = faker.internet.email();

            const user1: User = await userService.add(
                faker.name.firstName(),
                faker.name.lastName(),
                email,
                new SetPasswordDTO(password, password)
            );

            await userService.persist(user1);

            const user2: User = await userService.add(
                faker.name.firstName(),
                faker.name.lastName(),
                email,
                new SetPasswordDTO(password, password)
            );

            await expect(userService.persist(user2)).to.eventually.be.rejected.and.deep.include({
                target: user2,
                property: '_email',
                constraints: {UniqueConstraint: "email already exists"}
            })
        })

        it('check unicity if email is upper case', async function () {
            const password = faker.internet.password() + ".132";

            const email = faker.internet.email();

            const user1: User = await userService.add(
                faker.name.firstName(),
                faker.name.lastName(),
                email,
                new SetPasswordDTO(password, password)
            );

            await userService.persist(user1);

            const password2 = faker.internet.password() + ".132";

            const user2: User = await userService.add(
                faker.name.firstName(),
                faker.name.lastName(),
                email.toUpperCase(),
                new SetPasswordDTO(password2, password2)
            );

            await expect(userService.persist(user2)).to.eventually.be.rejected.and.deep.include({
                target: user2,
                property: '_email',
                constraints: {UniqueConstraint: "email already exists"}
            })
        })

        it('Long weak chararacters-only password', async function () {

            const longCharsOnlyPwd = new SetPasswordDTO("testtesttestttestetest", "testtesttestttestetest");

            await expect(userService.add(
                faker.name.firstName(),
                faker.name.lastName(),
                faker.internet.email(),
                longCharsOnlyPwd
            )).to.eventually.be.rejected.and.deep.include({
                property: 'password',
                constraints: {
                    matches: "Format de mot de passe incorrect, au moins une majuscule, une minuscule, un chiffre et un caractère spécial (_ $ & * ( ) @ # ? ! , | = + . : -) sont attendus"
                }
            })
        })

        it('Short password', async function () {
            const shortPassword = new SetPasswordDTO("test", "test");

            await expect(userService.add(
                faker.name.firstName(),
                faker.name.lastName(),
                faker.internet.email(),
                shortPassword
            )).to.eventually.be.rejected.and.deep.include({
                property: 'password',
                constraints: {
                    minLength: "Password should have at least 14 characters",
                    matches: "Format de mot de passe incorrect, au moins une majuscule, une minuscule, un chiffre et un caractère spécial (_ $ & * ( ) @ # ? ! , | = + . : -) sont attendus"
                }
            })
        })

        it('Validate password', async function () {
            const password = "tTest123453345554."
            const pwd = new SetPasswordDTO(password, password);

            const user : User = await userService.add(
                faker.name.firstName(),
                faker.name.lastName(),
                faker.internet.email(),
                pwd
            )

           const isPasswordValid = await user.isPasswordValid(password);

            expect(isPasswordValid).to.be.true
        })

        it('User has uuid as id', async function () {
            const pwd = new SetPasswordDTO("tTest123453345554.", "tTest123453345554.");

            const user : User = await userService.add(
                faker.name.firstName(),
                faker.name.lastName(),
                faker.internet.email(),
                pwd
            )

            await userRepo.save(user);

            const uuidRegExp = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/

            expect(uuidRegExp.test(user.id)).to.true;
        })
    })
})