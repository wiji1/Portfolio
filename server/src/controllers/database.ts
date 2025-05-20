import {configDotenv} from "dotenv";

const PROJECTS_TABLE = "projects";
const PROFILE_TABLE = "profile";

configDotenv();

const knex = require("knex")({
    client: "mysql",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
});

export { knex as db, PROJECTS_TABLE, PROFILE_TABLE }
