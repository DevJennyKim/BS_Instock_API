/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('warehouses', (table) => {
    table.increments('id').primary();
    table.string('warehouse_name', 255).notNullable();
    table.string('address', 255).notNullable();
    table.string('city', 255).notNullable();
    table.string('country', 255).notNullable();
    table.string('contact_name', 255).notNullable();
    table.string('contact_position', 255).notNullable();
    table.string('contact_phone', 255).notNullable();
    table.string('contact_email', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('warehouses');
}
