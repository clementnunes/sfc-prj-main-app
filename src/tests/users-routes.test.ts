import { server } from "../lib/fastify"
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {expect} from 'chai';
import {Done} from "mocha";
import {Response} from "light-my-request";
import {User} from "../entities/user";
import {DbConn} from "../dbConn";
import {UserService} from "../services/user-service";
import {SetPasswordDTO} from "../entities/dto/SetPasswordDTO";
import {DbConnector} from "../lib/db-connector";
import {usersRoutes} from "../lib/users-routes";
import {basicRoutes} from "../lib/basic-routes";
import {FastifyConfig} from "../config/fastify.config";
import {faker} from "@faker-js/faker"

chai.use(chaiAsPromised)


describe('/users', function () {
    const dbConn = DbConn.getInstance();
    const userRepo = dbConn.appDataSource.getRepository(User)
    const userService = UserService.getInstance(userRepo);



    let user: null|User = null;

    before(async () => {
        await userRepo.clear()

        const rand = Date.now();

        const password = faker.internet.password() + ".132";

        user = await userService.addAndPersist(
            faker.name.firstName(),
            faker.name.lastName(),
            faker.internet.email(),
            new SetPasswordDTO(password, password)
        )

        await server.register(DbConnector)
        await server.register(usersRoutes)
        await server.register(basicRoutes);

        await server.listen({ port: FastifyConfig.FASTIFY_PORT, host: FastifyConfig.FASTIFY_ADDR })
    })

    describe('POST #create', function () {
        it('should register the user', function () {
            return new Promise((resolve) => {
                const password = faker.internet.password() + ".132";

                server.inject({
                    url: `/users`,
                    method: 'POST',
                    payload: {
                        "email": faker.internet.email(),
                        "password": password,
                        "confirmPassword": password,
                        "firstName": faker.name.firstName(),
                        "lastName": faker.name.lastName()
                    }
                }).then((response: Response) => {
                    expect(response.statusCode).to.equal(200)
                    resolve(response);
                })
            })

        })
    })

    describe('GET', function () {

        it('tests',  (done: Done) => {
            server.inject({
                method: 'GET',
                url: '/tests'
            }).then((response: Response) => {
                expect(response.statusCode).to.equal(200)
            }).then(done, done);
        })

        it('should fetch one user',  () => {
            return new Promise(async (resolve) => {
                const firstUser = await userService.getFirst();

                if (!firstUser) {
                    return;
                }

                server.inject({
                    method: 'GET',
                    url: `/users/${firstUser.id}`
                }).then((response: Response) => {
                    expect(response.statusCode).to.equal(200);
                    resolve(response);
                })
            })
        })

        it('should fetch all users',  (done: Done) => {
            server.inject({
                method: 'GET',
                url: '/users'
            }).then((response: Response) => {
                expect(response.statusCode).to.equal(200)
                done();
            }).catch((err) => {
                done(err);
            })
        })
    })
})