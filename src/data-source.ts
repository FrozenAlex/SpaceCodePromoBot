import { DataSource } from "typeorm";
import { Contact } from "./entity/Contact";

// Import configs
require("dotenv").config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true,
    logging: true,
    entities: [Contact],
    subscribers: [],
    migrations: [],
})