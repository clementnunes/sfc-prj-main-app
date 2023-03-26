import {DataSource, DataSourceOptions} from "typeorm";
import {User} from "./entities/user";
import * as dotenv from 'dotenv'
import {DBConfig} from "./config/db.config";
dotenv.config()

export class DbConn {
    static INSTANCE : null|DbConn = null;
    readonly _appDataSource: DataSource;

    static IS_INITIALIZED : boolean;

    private constructor() {
        const options : DataSourceOptions = {
            type: "postgres",
            host: DBConfig.HOST,
            port: DBConfig.PORT,
            username: DBConfig.USERNAME,
            password: DBConfig.PASSWORD,
            database: DBConfig.INSTANCE_NAME,
            entities: [User],
            synchronize: true,
            logging: false
        };

        DbConn.IS_INITIALIZED = false;

        this._appDataSource = new DataSource(options);
    }

    static getInstance()
    {
        if(null == DbConn.INSTANCE)
            DbConn.INSTANCE = new DbConn();

        return DbConn.INSTANCE
    }

    get appDataSource(): DataSource
    {
        return this._appDataSource;
    }

    public initialize() : Promise<void>|null
    {
        return (!DbConn.IS_INITIALIZED ? this._appDataSource.initialize()
            .then(() => {
                console.log("Data Source has been initialized!")
                DbConn.IS_INITIALIZED = true;
                return;
            })
            .catch((err: Error) => {
                console.error("Error during Data Source initialization", err)
            }) : null);
    }
}