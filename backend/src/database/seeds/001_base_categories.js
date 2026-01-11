const baseCategories = [
  {
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    description: 'General residential cleaning, deep cleaning, and housekeeping support.'
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Leak repairs, fixture installations, and emergency plumbing assistance.'
  },
  {
    name: 'Electrical Repairs',
    slug: 'electrical-repairs',
    description: 'Wiring fixes, appliance installation, and electrical safety inspections.'
  },
  {
    name: 'Appliance Services',
    slug: 'appliance-services',
    description: 'Installation and repair for refrigerators, washing machines, and other appliances.'
  },
  {
    name: 'Painting & Renovation',
    slug: 'painting-renovation',
    description: 'Interior and exterior painting, small renovations, and finishing work.'
  }
];

// Ensures key marketplace categories exist for dashboard usage.
export async function seed (knex) {
  await knex.transaction(async (trx) => {
    for (const category of baseCategories) {
      const existing = await trx('categories').where({ slug: category.slug }).first();

      if (!existing) {
        await trx('categories').insert({
          ...category,
          is_active: true,
          created_at: trx.fn.now(),
          updated_at: trx.fn.now()
        });
      }
    }
  });
}
