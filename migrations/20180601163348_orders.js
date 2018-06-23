
exports.up = function(knex, Promise) {
    return knex.schema.createTable('orders', function(t) {
        t.increments('id').unsigned().primary();
        t.dateTime('createdAt').notNull();
        t.dateTime('deletedAt').nullable();

        t.string('productId').notNull();
        t.text('quantity').nullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('products');
};
