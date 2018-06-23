"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex = require("knex");
exports.db = knex({
    client: "postgresql",
    version: "7.4.9",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "root",
        database: "base"
    }
});
//# sourceMappingURL=db.js.map