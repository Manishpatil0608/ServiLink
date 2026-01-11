export async function up (knex) {
  const serviceAdmins = await knex('users').select('id').where('role', 'service_admin');
  for (const admin of serviceAdmins) {
    const existing = await knex('service_admins').where({ user_id: admin.id }).first();
    if (!existing) {
      await knex('service_admins').insert({ user_id: admin.id, department: null, created_at: knex.fn.now(), updated_at: knex.fn.now() });
    }
  }

  const superAdmins = await knex('users').select('id').where('role', 'super_admin');
  for (const admin of superAdmins) {
    const existing = await knex('super_admins').where({ user_id: admin.id }).first();
    if (!existing) {
      await knex('super_admins').insert({ user_id: admin.id, notes: null, created_at: knex.fn.now(), updated_at: knex.fn.now() });
    }
  }
}

export async function down () {}
