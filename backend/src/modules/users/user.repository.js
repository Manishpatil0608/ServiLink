import { db } from '../../config/database.js';

const userColumns = [
  'users.id',
  'users.email',
  'users.phone',
  'users.role',
  'users.status',
  'users.last_login_at',
  'users.created_at',
  'users.updated_at',
  'user_profiles.first_name',
  'user_profiles.last_name',
  'user_profiles.avatar_url'
];

export const findByEmail = async (email, trx = db) => {
  return trx('users')
    .select([...userColumns, 'users.password_hash'])
    .leftJoin('user_profiles', 'user_profiles.user_id', 'users.id')
    .where('users.email', email)
    .first();
};

export const findByPhone = async (phone, trx = db) => {
  return trx('users')
    .select([...userColumns, 'users.password_hash'])
    .leftJoin('user_profiles', 'user_profiles.user_id', 'users.id')
    .where('users.phone', phone)
    .first();
};

export const findById = async (id, trx = db) => {
  return trx('users')
    .select(userColumns)
    .leftJoin('user_profiles', 'user_profiles.user_id', 'users.id')
    .where('users.id', id)
    .first();
};

export const createUser = async (payload, trx) => {
  const [id] = await trx('users').insert(payload);
  return id;
};

export const createProfile = async (payload, trx) => {
  await trx('user_profiles').insert(payload);
};

export const createWallet = async (payload, trx) => {
  await trx('wallets').insert(payload);
};

export const ensureProviderRecord = async (payload, trx) => {
  await trx('service_providers').insert(payload);
};

export const ensureServiceAdminRecord = async (payload, trx) => {
  await trx('service_admins').insert(payload);
};

export const ensureSuperAdminRecord = async (payload, trx) => {
  await trx('super_admins').insert(payload);
};

export const updateLastLogin = async (userId, trx = db) => {
  await trx('users').where('id', userId).update({ last_login_at: db.fn.now() });
};

export const updatePasswordHash = async (userId, passwordHash, trx = db) => {
  await trx('users').where('id', userId).update({ password_hash: passwordHash, updated_at: db.fn.now() });
};
