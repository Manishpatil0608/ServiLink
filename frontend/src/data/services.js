export const serviceCategories = [
  'All',
  'Cleaning',
  'Repairs',
  'Beauty',
  'Wellness',
  'Tutoring',
  'Business'
];

export const services = [
  {
    id: 'SRV-101',
    title: 'Deep home cleaning',
    category: 'Cleaning',
    rating: 4.8,
    reviews: 182,
    price: '₹2,199',
    duration: '3 hrs',
    badges: ['Top rated', 'Eco-friendly supplies'],
    provider: 'FreshNest Cleaning Crew',
    summary: 'Intensive top-to-bottom cleaning ideal for pre-festive spruce-ups or quarterly maintenance.',
    includes: [
      'Kitchen degreasing and appliance wipe-down',
      'Bathroom descaling and sanitization',
      'Living room dusting with upholstery vacuuming',
      'Balcony pressure wash and window cleaning'
    ],
    highlights: [
      'Serves across South Mumbai • ETA 45 mins',
      'Equipment sanitized before every visit',
      'Includes 7-day workmanship warranty'
    ],
    slots: [
      { time: 'Today • 4:00 PM', status: 'Fastest' },
      { time: 'Tomorrow • 10:30 AM', status: 'Popular' },
      { time: 'Tomorrow • 6:00 PM', status: 'Evening' }
    ]
  },
  {
    id: 'SRV-109',
    title: 'Express kitchen detox',
    category: 'Cleaning',
    rating: 4.6,
    reviews: 134,
    price: '₹1,399',
    duration: '90 mins',
    badges: ['Stain guard', 'Food-safe chemicals'],
    provider: 'GleamPro Specialists',
    summary: 'Quick refresh for heavy-use kitchens with focus on counters, cabinets, and chimneys.',
    includes: [
      'Oil and grease removal from hobs and chimneys',
      'Cabinet exteriors and handles sanitized',
      'Sink and backsplash deep clean',
      'Final polish and deodorizing mist'
    ],
    highlights: [
      'Same-day bookings across 20 pincodes',
      'Food-safe plant-derived solutions',
      'Dedicated post-service quality audit'
    ],
    slots: [
      { time: 'Today • 2:00 PM', status: 'Fastest' },
      { time: 'Today • 5:30 PM', status: 'Limited' },
      { time: 'Tomorrow • 9:00 AM', status: 'Morning' }
    ]
  },
  {
    id: 'SRV-178',
    title: 'Electrician on demand',
    category: 'Repairs',
    rating: 4.7,
    reviews: 96,
    price: '₹299/hr',
    duration: 'Flexible',
    badges: ['Instant slots', '90-day warranty'],
    provider: 'VoltCare Associates',
    summary: 'Certified electricians for quick diagnostics, installations, and emergency fixes.',
    includes: [
      'Fan, switchboard, and fixture fixes',
      'Appliance installation and testing',
      'Load balancing and earthing checks',
      'Free safety report for every visit'
    ],
    highlights: [
      'Technicians reach within 60 mins',
      'Genuine spare parts with warranty',
      'Upfront hourly estimates, no hidden fees'
    ],
    slots: [
      { time: 'Today • 1:00 PM', status: 'Emergency' },
      { time: 'Today • 7:00 PM', status: 'After hours' },
      { time: 'Tomorrow • 11:30 AM', status: 'Popular' }
    ]
  },
  {
    id: 'SRV-187',
    title: 'Smart appliance repair',
    category: 'Repairs',
    rating: 4.5,
    reviews: 81,
    price: '₹749',
    duration: '1.5 hrs',
    badges: ['OEM spares', 'Warranty tracking'],
    provider: 'FixIt Labs',
    summary: 'Expert care for smart TVs, IoT appliances, and high-end kitchen devices.',
    includes: [
      'Diagnostic health check with firmware updates',
      'Preventive dust and moisture protection',
      'OEM spare replacement when required',
      'After-service performance benchmarking'
    ],
    highlights: [
      'Free pickup for complex repairs',
      'Insurance-backed damage cover',
      'Repair logs synced to manufacturer warranty'
    ],
    slots: [
      { time: 'Tomorrow • 9:30 AM', status: 'Popular' },
      { time: 'Tomorrow • 3:00 PM', status: 'Limited' },
      { time: 'Fri • 6:30 PM', status: 'Evening' }
    ]
  },
  {
    id: 'SRV-204',
    title: 'Salon at home - Luxe',
    category: 'Beauty',
    rating: 4.9,
    reviews: 220,
    price: '₹1,799',
    duration: '2 hrs',
    badges: ['Women only', 'Certified stylists'],
    provider: 'GlamCrew Elite',
    summary: 'Premium full-service grooming with international products and stylists.',
    includes: [
      'Signature facial and spa mani-pedi',
      'Hair spa with blow-dry finish',
      'At-home setup with disposable kits',
      'Post-service clean up and checklist'
    ],
    highlights: [
      'All stylists background verified',
      'Choice of vegan product range',
      'Lounge music and aromatherapy setup'
    ],
    slots: [
      { time: 'Today • 6:30 PM', status: 'Golden hour' },
      { time: 'Tomorrow • 11:00 AM', status: 'Popular' },
      { time: 'Sun • 4:00 PM', status: 'Weekend' }
    ]
  },
  {
    id: 'SRV-233',
    title: 'Wellness therapy session',
    category: 'Wellness',
    rating: 4.8,
    reviews: 64,
    price: '₹2,499',
    duration: '75 mins',
    badges: ['Licensed therapists', 'At-home spa kit'],
    provider: 'Restore Collective',
    summary: 'Holistic stress-relief therapy combining physiotherapy and mindfulness routines.',
    includes: [
      'Guided mobility and posture assessment',
      'Trigger point massage with essential oils',
      'Breathing and mindfulness coaching',
      'Personalised after-care plan'
    ],
    highlights: [
      'Therapists certified by AYUSH',
      'Reusable spa kit with every session',
      'Emergency support within 30 mins'
    ],
    slots: [
      { time: 'Today • 8:00 PM', status: 'Last slot' },
      { time: 'Tomorrow • 7:30 AM', status: 'Morning' },
      { time: 'Sat • 5:30 PM', status: 'Weekend' }
    ]
  },
  {
    id: 'SRV-250',
    title: 'STEM tutoring - Grade 9',
    category: 'Tutoring',
    rating: 4.6,
    reviews: 112,
    price: '₹899/session',
    duration: '60 mins',
    badges: ['Olympiad coach', 'Progress reports'],
    provider: 'MentorMatrix Academy',
    summary: 'Personalised STEM coaching aligned with CBSE and ICSE for Grade 9 students.',
    includes: [
      'Weekly concept mastery workshops',
      'Practice tests with analytics dashboard',
      'Parent-teacher review every fortnight',
      'STEM lab kits delivered quarterly'
    ],
    highlights: [
      'Sessions recorded for revision',
      'Olympiad mentorship add-on',
      'Adaptive homework engine'
    ],
    slots: [
      { time: 'Wed • 7:00 PM', status: 'Popular' },
      { time: 'Sat • 10:00 AM', status: 'Weekend' },
      { time: 'Sun • 5:00 PM', status: 'Evening' }
    ]
  },
  {
    id: 'SRV-271',
    title: 'Startup bookkeeping sprint',
    category: 'Business',
    rating: 4.7,
    reviews: 58,
    price: '₹6,999/mo',
    duration: 'Monthly retainers',
    badges: ['CA-led team', 'Investor ready'],
    provider: 'Ledgerline Partners',
    summary: 'Monthly compliance, MIS dashboards, and growth advisory tailored for startups.',
    includes: [
      'Monthly reconciliation and GST filing',
      'Investor-grade MIS dashboards',
      'Payroll and expense automation setup',
      'Quarterly CFO consultation'
    ],
    highlights: [
      'Plug-and-play with your accounting stack',
      'Encrypted document locker',
      'Dedicated relationship manager'
    ],
    slots: [
      { time: 'Kick-off within 48 hrs', status: 'Fastest' },
      { time: 'Next month batch', status: 'Limited' },
      { time: 'Quarterly pilot', status: 'Popular' }
    ]
  }
];

export const getServiceById = (serviceId) => services.find((service) => service.id === serviceId);

export const getServicesByCategory = (category) => {
  if (!category || category === 'All') {
    return services;
  }
  return services.filter((service) => service.category === category);
};
