
exports.up = function(knex, Promise) {
  return knex.raw(`
  alter table orders drop if exists productId;
  alter table orders add productsId int[];
  alter table orders alter productsId set not null;
  `)
};

exports.down = function(knex, Promise) {
  return knex.raw(`
  alter table orders drop if exists productsId;
  alter table orders add productId varchar(255);
  alter table orders alter productId set not null;
  `);
};
