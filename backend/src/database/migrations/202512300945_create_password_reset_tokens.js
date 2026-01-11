export async function up (knex) {
  const exists = await knex.schema.hasTable('password_reset_tokens');
  if (exists) {
    return;
  }

  await knex.schema.createTable('password_reset_tokens', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('token_hash', 255).notNullable().unique();
    table.dateTime('expires_at').notNullable();
    table.dateTime('used_at');
    table.timestamps(true, true);
    table.index(['user_id', 'token_hash'], 'idx_password_reset_tokens_user_hash');
  });
}

export async function down (knex) {
  await knex.schema.dropTableIfExists('password_reset_tokens');
}
