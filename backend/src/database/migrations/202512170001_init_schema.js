export async function up (knex) {
  await knex.schema.createTable('users', (table) => {
    table.bigIncrements('id').primary();
    table.string('email', 191).notNullable().unique();
    table.string('phone', 20).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.enu('role', ['customer', 'provider', 'service_admin', 'category_admin', 'master_admin', 'super_admin']).notNullable();
    table.enu('status', ['pending', 'active', 'suspended', 'deleted']).notNullable().defaultTo('pending');
    table.dateTime('last_login_at');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('user_profiles', (table) => {
    table.bigInteger('user_id').unsigned().primary().references('id').inTable('users').onDelete('CASCADE');
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('avatar_url', 255);
    table.date('dob');
    table.enu('gender', ['male', 'female', 'other', 'prefer_not_say']);
    table.string('address_line1', 191);
    table.string('address_line2', 191);
    table.string('city', 100);
    table.string('state', 100);
    table.string('country', 100);
    table.string('postal_code', 20);
    table.decimal('lat', 10, 7);
    table.decimal('lng', 10, 7);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('service_providers', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
    table.string('business_name', 191).notNullable();
    table.string('gst_number', 30).unique();
    table.string('pan_number', 15).unique();
    table.enu('verification_status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending');
    table.decimal('rating_average', 3, 2).notNullable().defaultTo(0.0);
    table.integer('total_reviews').unsigned().notNullable().defaultTo(0);
    table.timestamps(true, true);
    table.index('verification_status', 'idx_service_providers_status');
  });

  await knex.schema.createTable('categories', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('parent_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
    table.string('name', 150).notNullable().unique();
    table.string('slug', 150).notNullable().unique();
    table.text('description');
    table.string('icon_url', 255);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('category_admins', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
    table.bigInteger('category_id').unsigned().notNullable().references('id').inTable('categories').onDelete('CASCADE');
    table.dateTime('assigned_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('services', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('provider_id').unsigned().notNullable().references('id').inTable('service_providers').onDelete('CASCADE');
    table.bigInteger('category_id').unsigned().notNullable().references('id').inTable('categories').onDelete('CASCADE');
    table.string('title', 191).notNullable();
    table.text('description').notNullable();
    table.decimal('base_price', 10, 2).notNullable();
    table.enu('price_unit', ['per_hour', 'per_job', 'per_day']).notNullable();
    table.decimal('service_radius_km', 5, 2);
    table.integer('avg_duration_minutes');
    table.boolean('is_active').notNullable().defaultTo(false);
    table.string('rejection_reason', 255);
    table.timestamps(true, true);
    table.index('is_active', 'idx_services_active');
    table.index('category_id', 'idx_services_category');
  });

  await knex.schema.createTable('availability', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('service_id').unsigned().notNullable().references('id').inTable('services').onDelete('CASCADE');
    table.integer('weekday').unsigned().notNullable();
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.boolean('is_recurring').notNullable().defaultTo(true);
    table.date('custom_date');
    table.boolean('is_available').notNullable().defaultTo(true);
    table.timestamps(true, true);
    table.index(['service_id', 'weekday'], 'idx_availability_service_weekday');
  });

  await knex.schema.createTable('bookings', (table) => {
    table.bigIncrements('id').primary();
    table.string('booking_code', 12).notNullable().unique();
    table.bigInteger('customer_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.bigInteger('provider_id').unsigned().notNullable().references('id').inTable('service_providers').onDelete('CASCADE');
    table.bigInteger('service_id').unsigned().notNullable().references('id').inTable('services').onDelete('CASCADE');
    table.dateTime('scheduled_start').notNullable();
    table.dateTime('scheduled_end').notNullable();
    table.string('address_line1', 191).notNullable();
    table.string('address_line2', 191);
    table.string('city', 100).notNullable();
    table.string('state', 100).notNullable();
    table.string('country', 100).notNullable();
    table.string('postal_code', 20).notNullable();
    table.decimal('lat', 10, 7);
    table.decimal('lng', 10, 7);
    table.enu('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded']).notNullable().defaultTo('pending');
    table.decimal('subtotal', 10, 2).notNullable();
    table.decimal('tax', 10, 2).notNullable().defaultTo(0.0);
    table.decimal('total_amount', 10, 2).notNullable();
    table.enu('payment_status', ['pending', 'paid', 'failed', 'refunded', 'partial']).notNullable().defaultTo('pending');
    table.string('cancellation_reason', 255);
    table.timestamps(true, true);
    table.index('customer_id', 'idx_bookings_customer');
    table.index('provider_id', 'idx_bookings_provider');
    table.index('status', 'idx_bookings_status');
  });

  await knex.schema.createTable('payments', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('booking_id').unsigned().notNullable().references('id').inTable('bookings').onDelete('CASCADE');
    table.bigInteger('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.decimal('amount', 10, 2).notNullable();
    table.string('currency', 3).notNullable().defaultTo('INR');
    table.enu('payment_method', ['card', 'upi', 'netbanking', 'wallet', 'cod']).notNullable();
    table.string('gateway_transaction_id', 191).unique();
    table.enu('status', ['initiated', 'captured', 'failed', 'refunded']).notNullable().defaultTo('initiated');
    table.dateTime('captured_at');
    table.timestamps(true, true);
    table.index('status', 'idx_payments_status');
  });

  await knex.schema.createTable('wallets', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
    table.decimal('balance', 12, 2).notNullable().defaultTo(0.0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('wallet_transactions', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('wallet_id').unsigned().notNullable().references('id').inTable('wallets').onDelete('CASCADE');
    table.bigInteger('booking_id').unsigned().references('id').inTable('bookings').onDelete('SET NULL');
    table.enu('type', ['credit', 'debit']).notNullable();
    table.enu('reference_type', ['booking', 'refund', 'payout', 'adjustment', 'promotion']).notNullable();
    table.bigInteger('reference_id').unsigned();
    table.decimal('amount', 10, 2).notNullable();
    table.decimal('balance_after', 12, 2).notNullable();
    table.string('remarks', 255);
    table.timestamps(true, true);
    table.index('wallet_id', 'idx_wallet_transactions_wallet');
    table.index(['reference_type', 'reference_id'], 'idx_wallet_transactions_reference');
  });

  await knex.schema.createTable('reviews', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('booking_id').unsigned().notNullable().unique().references('id').inTable('bookings').onDelete('CASCADE');
    table.bigInteger('customer_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.bigInteger('provider_id').unsigned().notNullable().references('id').inTable('service_providers').onDelete('CASCADE');
    table.integer('rating').unsigned().notNullable();
    table.text('review_text');
    table.boolean('is_flagged').notNullable().defaultTo(false);
    table.timestamps(true, true);
    table.index('provider_id', 'idx_reviews_provider');
    table.index('customer_id', 'idx_reviews_customer');
  });

  await knex.schema.createTable('notifications', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title', 191).notNullable();
    table.text('message').notNullable();
    table.enu('type', ['booking', 'payment', 'support', 'system']).notNullable();
    table.enu('status', ['unread', 'read']).notNullable().defaultTo('unread');
    table.json('metadata');
    table.enu('sent_via', ['push', 'sms', 'email', 'in_app']).notNullable().defaultTo('in_app');
    table.dateTime('read_at');
    table.timestamps(true, true);
    table.index(['user_id', 'status'], 'idx_notifications_user_status');
  });

  await knex.schema.createTable('support_tickets', (table) => {
    table.bigIncrements('id').primary();
    table.string('ticket_code', 12).notNullable().unique();
    table.bigInteger('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.bigInteger('assigned_to').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.enu('category', ['booking', 'payment', 'provider', 'technical', 'other']).notNullable();
    table.enu('priority', ['low', 'medium', 'high', 'urgent']).notNullable().defaultTo('medium');
    table.enu('status', ['open', 'in_progress', 'resolved', 'closed']).notNullable().defaultTo('open');
    table.string('subject', 191).notNullable();
    table.text('description').notNullable();
    table.bigInteger('related_booking_id').unsigned().references('id').inTable('bookings').onDelete('SET NULL');
    table.bigInteger('related_provider_id').unsigned().references('id').inTable('service_providers').onDelete('SET NULL');
    table.timestamps(true, true);
    table.index('status', 'idx_support_status');
    table.index('assigned_to', 'idx_support_assigned');
  });

  await knex.schema.createTable('ticket_messages', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('ticket_id').unsigned().notNullable().references('id').inTable('support_tickets').onDelete('CASCADE');
    table.bigInteger('sender_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('message').notNullable();
    table.json('attachments');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('refresh_tokens', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('token_hash', 255).notNullable().unique();
    table.dateTime('expires_at').notNullable();
    table.dateTime('revoked_at');
    table.string('revoked_reason', 191);
    table.timestamps(true, true);
    table.index(['user_id', 'token_hash'], 'idx_refresh_tokens_user_hash');
  });
}

export async function down (knex) {
  await knex.schema.dropTableIfExists('refresh_tokens');
  await knex.schema.dropTableIfExists('ticket_messages');
  await knex.schema.dropTableIfExists('support_tickets');
  await knex.schema.dropTableIfExists('notifications');
  await knex.schema.dropTableIfExists('reviews');
  await knex.schema.dropTableIfExists('wallet_transactions');
  await knex.schema.dropTableIfExists('wallets');
  await knex.schema.dropTableIfExists('payments');
  await knex.schema.dropTableIfExists('bookings');
  await knex.schema.dropTableIfExists('availability');
  await knex.schema.dropTableIfExists('services');
  await knex.schema.dropTableIfExists('category_admins');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('service_providers');
  await knex.schema.dropTableIfExists('user_profiles');
  await knex.schema.dropTableIfExists('users');
}
