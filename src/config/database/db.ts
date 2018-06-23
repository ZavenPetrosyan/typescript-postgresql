import * as knex from 'knex';
export const db = knex({
    client: "postgresql",
    version: "7.4.9",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "root",
        database: "base"
    }
});