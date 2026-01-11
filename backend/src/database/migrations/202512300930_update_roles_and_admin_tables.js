export async function up (knex) {
  await knex.schema.raw('ALTER TABLE `users` MODIFY `role` ENUM(\'customer\',\'provider\',\'service_admin\',\'category_admin\',\'master_admin\',\'super_admin\') NOT NULL');

  const hasServiceAdmins = await knex.schema.hasTable('service_admins');
  if (!hasServiceAdmins) {
    await knex.schema.createTable('service_admins', (table) => {
      table.bigIncrements('id').primary();
      table.bigInteger('user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
      table.string('department', 150);
      table.timestamps(true, true);
    });
  }

  const hasSuperAdmins = await knex.schema.hasTable('super_admins');
  if (!hasSuperAdmins) {
    await knex.schema.createTable('super_admins', (table) => {
      table.bigIncrements('id').primary();
      table.bigInteger('user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
      table.string('notes', 255);
      table.timestamps(true, true);
    });
  }
}

export async function down (knex) {
  const hasSuperAdmins = await knex.schema.hasTable('super_admins');
  if (hasSuperAdmins) {
    await knex.schema.dropTable('super_admins');
  }

  const hasServiceAdmins = await knex.schema.hasTable('service_admins');
  if (hasServiceAdmins) {
    await knex.schema.dropTable('service_admins');
  }

  await knex.schema.raw('ALTER TABLE `users` MODIFY `role` ENUM(\'customer\',\'provider\',\'category_admin\',\'master_admin\') NOT NULL');
}
