
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (t) => {
        t.increments('id').unsigned().primary();
        t.string('email').nullable();
        t.string('password').nullable();
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('users');
};
