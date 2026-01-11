import bcrypt from 'bcrypt';

const providers = [
  {
    email: 'test1@gmail.com',
    phone: '9000000001',
    password: 'Test1@9923',
    firstName: 'Test',
    lastName: 'One',
    businessName: 'FreshNest Cleaning Crew',
    ratingAverage: 4.8,
    totalReviews: 182,
    services: [
      {
        title: 'Deep home cleaning',
        categorySlug: 'home-cleaning',
        description: 'Intensive top-to-bottom cleaning ideal for festive spruce-ups or quarterly maintenance. Includes kitchen degreasing, bathroom sanitization, and upholstery care.',
        basePrice: 2199,
        taxRate: 18,
        priceUnit: 'per_job',
        serviceRadiusKm: 15,
        avgDurationMinutes: 180,
        availability: [
          { weekday: 1, startTime: '09:00', endTime: '13:00' },
          { weekday: 3, startTime: '14:00', endTime: '18:00' },
          { weekday: 5, startTime: '10:00', endTime: '14:00' }
        ]
      },
      {
        title: 'Express kitchen detox',
        categorySlug: 'home-cleaning',
        description: 'Quick refresh for heavy-use kitchens with focus on counters, cabinets, and chimneys. Uses food-safe chemicals and sanitised equipment.',
        basePrice: 1399,
        taxRate: 12,
        priceUnit: 'per_job',
        serviceRadiusKm: 12,
        avgDurationMinutes: 90,
        availability: [
          { weekday: 2, startTime: '11:00', endTime: '14:00' },
          { weekday: 4, startTime: '15:00', endTime: '18:00' }
        ]
      }
    ]
  },
  {
    email: 'test2@gmail.com',
    phone: '9000000002',
    password: 'Test2@9923',
    firstName: 'Test',
    lastName: 'Two',
    businessName: 'VoltCare Technicians',
    ratingAverage: 4.7,
    totalReviews: 96,
    services: [
      {
        title: 'Emergency electrician on demand',
        categorySlug: 'electrical-repairs',
        description: 'Certified electricians for urgent diagnostics, appliance installation, and emergency fixes. Includes safety inspection after every visit.',
        basePrice: 299,
        taxRate: 5,
        priceUnit: 'per_hour',
        serviceRadiusKm: 25,
        avgDurationMinutes: 60,
        availability: [
          { weekday: 0, startTime: '08:00', endTime: '20:00' },
          { weekday: 6, startTime: '08:00', endTime: '16:00' }
        ]
      }
    ]
  },
  {
    email: 'test3@gmail.com',
    phone: '9000000003',
    password: 'Test3@9923',
    firstName: 'Test',
    lastName: 'Three',
    businessName: 'RenewCo Interiors',
    ratingAverage: 4.6,
    totalReviews: 58,
    services: [
      {
        title: 'Interior painting and touch-ups',
        categorySlug: 'painting-renovation',
        description: 'Interior repainting with low-VOC paints, minor wall repairs, and post-paint clean-up. Includes colour consultation and finish testing.',
        basePrice: 4999,
        taxRate: 18,
        priceUnit: 'per_job',
        serviceRadiusKm: 30,
        avgDurationMinutes: 360,
        availability: [
          { weekday: 1, startTime: '09:00', endTime: '17:00' },
          { weekday: 4, startTime: '09:00', endTime: '17:00' }
        ]
      }
    ]
  }
];

const ensureCategoryMap = async (trx) => {
  const categories = await trx('categories').select(['id', 'slug']);
  return categories.reduce((acc, category) => {
    acc[category.slug] = category.id;
    return acc;
  }, {});
};

export async function seed (knex) {
  await knex.transaction(async (trx) => {
    const categoryMap = await ensureCategoryMap(trx);

    for (const provider of providers) {
      const existingUser = await trx('users').where({ email: provider.email }).first();
      if (existingUser) {
        continue;
      }

      const passwordHash = await bcrypt.hash(provider.password, 12);
      const [userId] = await trx('users').insert({
        email: provider.email,
        phone: provider.phone,
        password_hash: passwordHash,
        role: 'provider',
        status: 'active'
      });

      await trx('user_profiles').insert({
        user_id: userId,
        first_name: provider.firstName,
        last_name: provider.lastName
      });

      await trx('wallets').insert({ user_id: userId, balance: 0 });

      const [providerId] = await trx('service_providers').insert({
        user_id: userId,
        business_name: provider.businessName,
        verification_status: 'approved',
        rating_average: provider.ratingAverage,
        total_reviews: provider.totalReviews
      });

      for (const service of provider.services) {
        const categoryId = categoryMap[service.categorySlug];
        if (!categoryId) {
          continue;
        }

        const [serviceId] = await trx('services').insert({
          provider_id: providerId,
          category_id: categoryId,
          title: service.title,
          description: service.description,
          base_price: service.basePrice,
          tax_rate: service.taxRate ?? 0,
          price_unit: service.priceUnit,
          service_radius_km: service.serviceRadiusKm,
          avg_duration_minutes: service.avgDurationMinutes,
          is_active: true
        });

        if (service.availability?.length) {
          const availabilityRows = service.availability.map((slot) => ({
            service_id: serviceId,
            weekday: slot.weekday,
            start_time: `${slot.startTime}:00`,
            end_time: `${slot.endTime}:00`,
            is_recurring: true,
            is_available: true
          }));
          await trx('availability').insert(availabilityRows);
        }
      }
    }
  });
}
