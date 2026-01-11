export async function up (knex) {
  await knex.schema.alterTable('services', (table) => {
    table.decimal('tax_rate', 5, 2).notNullable().defaultTo(0.0);
  });

  await knex('services').update({ tax_rate: 18.0 });
}

export async function down (knex) {
  await knex.schema.alterTable('services', (table) => {
    table.dropColumn('tax_rate');
  });
}
