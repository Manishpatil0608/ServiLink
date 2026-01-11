import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

const nowPlusHours = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000);

export async function seed (knex) {
  await knex.transaction(async (trx) => {
    const tablesToClear = [
      'ticket_messages',
      'support_tickets',
      'notifications',
      'reviews',
      'wallet_transactions',
      'payments',
      'bookings',
      'availability',
      'services',
      'category_admins',
      'service_admins',
      'super_admins',
      'service_providers',
      'wallets',
      'user_profiles',
      'password_reset_tokens',
      'refresh_tokens'
    ];

    for (const table of tablesToClear) {
      // Clear dependent tables before inserting fresh sample data
      await trx(table).del();
    }

    await trx('users').del();

    const categories = await trx('categories').select(['id', 'slug']).orderBy('id', 'asc');
    const categoriesBySlug = categories.reduce((acc, category) => {
      acc[category.slug] = category.id;
      return acc;
    }, {});

    if (categories.length < 5) {
      throw new Error('At least five categories are required before running this seed.');
    }

    const userFixtures = [
      { ref: 'custAlex', role: 'customer', email: 'alex.customer@example.com', phone: '9001000001', password: 'Local@1001', firstName: 'Alex', lastName: 'Fernandez', city: 'Mumbai', state: 'Maharashtra', walletBalance: 450.5 },
      { ref: 'custBina', role: 'customer', email: 'bina.customer@example.com', phone: '9001000002', password: 'Local@1002', firstName: 'Bina', lastName: 'Kapoor', city: 'New Delhi', state: 'Delhi', walletBalance: 120.0 },
      { ref: 'custChirag', role: 'customer', email: 'chirag.customer@example.com', phone: '9001000003', password: 'Local@1003', firstName: 'Chirag', lastName: 'Patel', city: 'Ahmedabad', state: 'Gujarat', walletBalance: 80.25 },
      { ref: 'custDivya', role: 'customer', email: 'divya.customer@example.com', phone: '9001000004', password: 'Local@1004', firstName: 'Divya', lastName: 'Reddy', city: 'Hyderabad', state: 'Telangana', walletBalance: 215.75 },
      { ref: 'custEsha', role: 'customer', email: 'esha.customer@example.com', phone: '9001000005', password: 'Local@1005', firstName: 'Esha', lastName: 'Singh', city: 'Jaipur', state: 'Rajasthan', walletBalance: 65.5 },
      { ref: 'provIshan', role: 'provider', email: 'ishan.provider@example.com', phone: '9002000001', password: 'Local@2001', firstName: 'Ishan', lastName: 'Malik', city: 'Mumbai', state: 'Maharashtra', walletBalance: 0, provider: { businessName: 'SparkClean Services', gstNumber: '27SPKCL0001Z5', panNumber: 'SPKPM0001A', ratingAverage: 4.6, totalReviews: 134 } },
      { ref: 'provJyoti', role: 'provider', email: 'jyoti.provider@example.com', phone: '9002000002', password: 'Local@2002', firstName: 'Jyoti', lastName: 'Pradhan', city: 'Bengaluru', state: 'Karnataka', walletBalance: 0, provider: { businessName: 'VoltFix Electricians', gstNumber: '29VLTFX0002Z9', panNumber: 'VLTJP0002B', ratingAverage: 4.8, totalReviews: 201 } },
      { ref: 'provKaran', role: 'provider', email: 'karan.provider@example.com', phone: '9002000003', password: 'Local@2003', firstName: 'Karan', lastName: 'Jain', city: 'Pune', state: 'Maharashtra', walletBalance: 0, provider: { businessName: 'PlumbSure Experts', gstNumber: '27PLMSR0003Z4', panNumber: 'PLMKR0003C', ratingAverage: 4.5, totalReviews: 156 } },
      { ref: 'provLata', role: 'provider', email: 'lata.provider@example.com', phone: '9002000004', password: 'Local@2004', firstName: 'Lata', lastName: 'Mukherjee', city: 'Kolkata', state: 'West Bengal', walletBalance: 0, provider: { businessName: 'Appliance Care Gurus', gstNumber: '19APLCG0004Z1', panNumber: 'APLML0004D', ratingAverage: 4.4, totalReviews: 98 } },
      { ref: 'provManoj', role: 'provider', email: 'manoj.provider@example.com', phone: '9002000005', password: 'Local@2005', firstName: 'Manoj', lastName: 'Verma', city: 'Chandigarh', state: 'Chandigarh', walletBalance: 0, provider: { businessName: 'Renova Painters', gstNumber: '04RNVPN0005Z8', panNumber: 'RNVVM0005E', ratingAverage: 4.7, totalReviews: 142 } },
      { ref: 'catAnita', role: 'category_admin', email: 'anita.category@example.com', phone: '9003000001', password: 'Local@3001', firstName: 'Anita', lastName: 'Saxena', city: 'Lucknow', state: 'Uttar Pradesh', walletBalance: 0 },
      { ref: 'catBhavesh', role: 'category_admin', email: 'bhavesh.category@example.com', phone: '9003000002', password: 'Local@3002', firstName: 'Bhavesh', lastName: 'Rao', city: 'Surat', state: 'Gujarat', walletBalance: 0 },
      { ref: 'catCeline', role: 'category_admin', email: 'celine.category@example.com', phone: '9003000003', password: 'Local@3003', firstName: 'Celine', lastName: 'George', city: 'Kochi', state: 'Kerala', walletBalance: 0 },
      { ref: 'catDevika', role: 'category_admin', email: 'devika.category@example.com', phone: '9003000004', password: 'Local@3004', firstName: 'Devika', lastName: 'Iyer', city: 'Chennai', state: 'Tamil Nadu', walletBalance: 0 },
      { ref: 'catEmanuel', role: 'category_admin', email: 'emanuel.category@example.com', phone: '9003000005', password: 'Local@3005', firstName: 'Emanuel', lastName: 'Pinto', city: 'Panaji', state: 'Goa', walletBalance: 0 },
      { ref: 'svcMahesh', role: 'service_admin', email: 'mahesh.service@example.com', phone: '9004000001', password: 'Local@4001', firstName: 'Mahesh', lastName: 'Kulkarni', city: 'Nagpur', state: 'Maharashtra', walletBalance: 0, serviceAdmin: { department: 'North Operations' } },
      { ref: 'svcNirali', role: 'service_admin', email: 'nirali.service@example.com', phone: '9004000002', password: 'Local@4002', firstName: 'Nirali', lastName: 'Shah', city: 'Vadodara', state: 'Gujarat', walletBalance: 0, serviceAdmin: { department: 'West Operations' } },
      { ref: 'svcOmkar', role: 'service_admin', email: 'omkar.service@example.com', phone: '9004000003', password: 'Local@4003', firstName: 'Omkar', lastName: 'Banerjee', city: 'Kolkata', state: 'West Bengal', walletBalance: 0, serviceAdmin: { department: 'East Operations' } },
      { ref: 'svcPrisha', role: 'service_admin', email: 'prisha.service@example.com', phone: '9004000004', password: 'Local@4004', firstName: 'Prisha', lastName: 'Menon', city: 'Thiruvananthapuram', state: 'Kerala', walletBalance: 0, serviceAdmin: { department: 'South Operations' } },
      { ref: 'svcQadir', role: 'service_admin', email: 'qadir.service@example.com', phone: '9004000005', password: 'Local@4005', firstName: 'Qadir', lastName: 'Ali', city: 'Bhopal', state: 'Madhya Pradesh', walletBalance: 0, serviceAdmin: { department: 'Central Operations' } },
      { ref: 'supRaina', role: 'super_admin', email: 'raina.super@example.com', phone: '9005000001', password: 'Local@5001', firstName: 'Raina', lastName: 'Deshpande', city: 'Pune', state: 'Maharashtra', walletBalance: 0, superAdmin: { notes: 'Primary oversight for western region.' } },
      { ref: 'supSameer', role: 'super_admin', email: 'sameer.super@example.com', phone: '9005000002', password: 'Local@5002', firstName: 'Sameer', lastName: 'Khan', city: 'Jaipur', state: 'Rajasthan', walletBalance: 0, superAdmin: { notes: 'Focus on provider compliance.' } },
      { ref: 'supTanvi', role: 'super_admin', email: 'tanvi.super@example.com', phone: '9005000003', password: 'Local@5003', firstName: 'Tanvi', lastName: 'Chopra', city: 'Indore', state: 'Madhya Pradesh', walletBalance: 0, superAdmin: { notes: 'Drives customer experience improvements.' } },
      { ref: 'supUdit', role: 'super_admin', email: 'udit.super@example.com', phone: '9005000004', password: 'Local@5004', firstName: 'Udit', lastName: 'Singla', city: 'Delhi', state: 'Delhi', walletBalance: 0, superAdmin: { notes: 'Handles finance and settlements.' } },
      { ref: 'supVarsha', role: 'super_admin', email: 'varsha.super@example.com', phone: '9005000005', password: 'Local@5005', firstName: 'Varsha', lastName: 'Naidu', city: 'Bengaluru', state: 'Karnataka', walletBalance: 0, superAdmin: { notes: 'Leads platform reliability initiatives.' } }
    ];

    const userIds = {};
    const walletIds = {};

    for (const user of userFixtures) {
      const passwordHash = await bcrypt.hash(user.password, 12);
      const [userId] = await trx('users').insert({
        email: user.email,
        phone: user.phone,
        password_hash: passwordHash,
        role: user.role,
        status: 'active',
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });

      userIds[user.ref] = userId;

      await trx('user_profiles').insert({
        user_id: userId,
        first_name: user.firstName,
        last_name: user.lastName,
        city: user.city,
        state: user.state,
        country: 'India',
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });

      const [walletId] = await trx('wallets').insert({
        user_id: userId,
        balance: user.walletBalance,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });

      walletIds[user.ref] = walletId;
    }

    const serviceProviderIds = {};

    const providerUsers = userFixtures.filter((user) => user.role === 'provider');
    for (const provider of providerUsers) {
      const providerMeta = provider.provider;
      const [providerId] = await trx('service_providers').insert({
        user_id: userIds[provider.ref],
        business_name: providerMeta.businessName,
        gst_number: providerMeta.gstNumber,
        pan_number: providerMeta.panNumber,
        verification_status: 'approved',
        rating_average: providerMeta.ratingAverage,
        total_reviews: providerMeta.totalReviews,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });

      serviceProviderIds[provider.ref] = providerId;
    }

    const categoryAdminRefs = ['catAnita', 'catBhavesh', 'catCeline', 'catDevika', 'catEmanuel'];
    for (let i = 0; i < 5; i++) {
      await trx('category_admins').insert({
        user_id: userIds[categoryAdminRefs[i]],
        category_id: categories[i].id,
        assigned_at: trx.fn.now()
      });
    }

    const serviceAdminUsers = userFixtures.filter((user) => user.role === 'service_admin');
    for (const admin of serviceAdminUsers) {
      await trx('service_admins').insert({
        user_id: userIds[admin.ref],
        department: admin.serviceAdmin.department,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });
    }

    const superAdminUsers = userFixtures.filter((user) => user.role === 'super_admin');
    for (const admin of superAdminUsers) {
      await trx('super_admins').insert({
        user_id: userIds[admin.ref],
        notes: admin.superAdmin.notes,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });
    }

    const serviceFixtures = [
      {
        ref: 'svcDeepClean',
        providerRef: 'provIshan',
        categorySlug: 'home-cleaning',
        title: 'Spark Deep Clean Package',
        description: 'Comprehensive top-to-bottom home cleaning using eco-friendly agents and two-person crew.',
        basePrice: 2299,
        taxRate: 18,
        priceUnit: 'per_job',
        serviceRadiusKm: 18,
        avgDurationMinutes: 210,
        availability: [{ weekday: 1, startTime: '09:00', endTime: '13:00' }]
      },
      {
        ref: 'svcElectrical',
        providerRef: 'provJyoti',
        categorySlug: 'electrical-repairs',
        title: 'Emergency Electrical Diagnostics',
        description: 'Rapid response electricians for outage diagnostics, MCB replacement, and appliance wiring fixes.',
        basePrice: 499,
        taxRate: 12,
        priceUnit: 'per_hour',
        serviceRadiusKm: 25,
        avgDurationMinutes: 90,
        availability: [{ weekday: 2, startTime: '10:00', endTime: '12:00' }]
      },
      {
        ref: 'svcPlumbing',
        providerRef: 'provKaran',
        categorySlug: 'plumbing',
        title: 'Premium Plumbing Care',
        description: 'Leak detection, bathroom fitting installation, and annual maintenance for residential plumbing.',
        basePrice: 749,
        taxRate: 18,
        priceUnit: 'per_hour',
        serviceRadiusKm: 20,
        avgDurationMinutes: 120,
        availability: [{ weekday: 3, startTime: '11:00', endTime: '14:00' }]
      },
      {
        ref: 'svcAppliance',
        providerRef: 'provLata',
        categorySlug: 'appliance-services',
        title: 'Home Appliance Tune-Up',
        description: 'Expert maintenance for refrigerators, washing machines, and AC units including performance diagnostics.',
        basePrice: 1599,
        taxRate: 12,
        priceUnit: 'per_job',
        serviceRadiusKm: 22,
        avgDurationMinutes: 150,
        availability: [{ weekday: 4, startTime: '13:00', endTime: '17:00' }]
      },
      {
        ref: 'svcRenovation',
        providerRef: 'provManoj',
        categorySlug: 'painting-renovation',
        title: 'Interior Repaint Essentials',
        description: 'Interior wall repainting with low-VOC paints, patch repairs, and furniture masking.',
        basePrice: 5299,
        taxRate: 18,
        priceUnit: 'per_job',
        serviceRadiusKm: 30,
        avgDurationMinutes: 360,
        availability: [{ weekday: 5, startTime: '09:00', endTime: '17:00' }]
      }
    ];

    const serviceIds = {};

    for (const service of serviceFixtures) {
      const [serviceId] = await trx('services').insert({
        provider_id: serviceProviderIds[service.providerRef],
        category_id: categoriesBySlug[service.categorySlug],
        title: service.title,
        description: service.description,
        base_price: service.basePrice,
        tax_rate: service.taxRate,
        price_unit: service.priceUnit,
        service_radius_km: service.serviceRadiusKm,
        avg_duration_minutes: service.avgDurationMinutes,
        is_active: true,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });

      serviceIds[service.ref] = serviceId;

      for (const slot of service.availability) {
        await trx('availability').insert({
          service_id: serviceId,
          weekday: slot.weekday,
          start_time: `${slot.startTime}:00`,
          end_time: `${slot.endTime}:00`,
          is_recurring: true,
          is_available: true,
          created_at: trx.fn.now(),
          updated_at: trx.fn.now()
        });
      }
    }

    const bookingFixtures = [
      {
        ref: 'booking1',
        bookingCode: 'BK25A001AZ01',
        customerRef: 'custAlex',
        providerRef: 'provIshan',
        serviceRef: 'svcDeepClean',
        scheduledStart: '2025-01-10T09:00:00',
        scheduledEnd: '2025-01-10T13:00:00',
        addressLine1: '12 Sunrise Apartments',
        addressLine2: 'Powai',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400076',
        status: 'completed',
        subtotal: 2299,
        tax: 413.82,
        totalAmount: 2712.82,
        paymentStatus: 'paid'
      },
      {
        ref: 'booking2',
        bookingCode: 'BK25A002BZ02',
        customerRef: 'custBina',
        providerRef: 'provJyoti',
        serviceRef: 'svcElectrical',
        scheduledStart: '2025-01-11T10:00:00',
        scheduledEnd: '2025-01-11T12:00:00',
        addressLine1: '44 Residency Greens',
        addressLine2: 'Dwarka Sector 11',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        postalCode: '110075',
        status: 'completed',
        subtotal: 998,
        tax: 119.76,
        totalAmount: 1117.76,
        paymentStatus: 'paid'
      },
      {
        ref: 'booking3',
        bookingCode: 'BK25A003CY03',
        customerRef: 'custChirag',
        providerRef: 'provKaran',
        serviceRef: 'svcPlumbing',
        scheduledStart: '2025-01-12T11:30:00',
        scheduledEnd: '2025-01-12T13:30:00',
        addressLine1: '8 Lakeview Towers',
        addressLine2: 'Vastrapur',
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
        postalCode: '380015',
        status: 'confirmed',
        subtotal: 1498,
        tax: 269.64,
        totalAmount: 1767.64,
        paymentStatus: 'paid'
      },
      {
        ref: 'booking4',
        bookingCode: 'BK25A004DX04',
        customerRef: 'custDivya',
        providerRef: 'provLata',
        serviceRef: 'svcAppliance',
        scheduledStart: '2025-01-13T14:00:00',
        scheduledEnd: '2025-01-13T17:00:00',
        addressLine1: '101 Pearl Residency',
        addressLine2: 'Gachibowli',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        postalCode: '500032',
        status: 'in_progress',
        subtotal: 1599,
        tax: 191.88,
        totalAmount: 1790.88,
        paymentStatus: 'paid'
      },
      {
        ref: 'booking5',
        bookingCode: 'BK25A005EW05',
        customerRef: 'custEsha',
        providerRef: 'provManoj',
        serviceRef: 'svcRenovation',
        scheduledStart: '2025-01-14T09:30:00',
        scheduledEnd: '2025-01-14T15:30:00',
        addressLine1: '55 Royal Enclave',
        addressLine2: 'Vaishali Nagar',
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        postalCode: '302021',
        status: 'pending',
        subtotal: 5299,
        tax: 953.82,
        totalAmount: 6252.82,
        paymentStatus: 'pending'
      }
    ];

    const bookingIds = {};

    for (const booking of bookingFixtures) {
      const [bookingId] = await trx('bookings').insert({
        booking_code: booking.bookingCode,
        customer_id: userIds[booking.customerRef],
        provider_id: serviceProviderIds[booking.providerRef],
        service_id: serviceIds[booking.serviceRef],
        scheduled_start: booking.scheduledStart,
        scheduled_end: booking.scheduledEnd,
        address_line1: booking.addressLine1,
        address_line2: booking.addressLine2,
        city: booking.city,
        state: booking.state,
        country: booking.country,
        postal_code: booking.postalCode,
        status: booking.status,
        subtotal: booking.subtotal,
        tax: booking.tax,
        total_amount: booking.totalAmount,
        payment_status: booking.paymentStatus,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });

      bookingIds[booking.ref] = bookingId;
    }

    const paymentFixtures = [
      { bookingRef: 'booking1', userRef: 'custAlex', amount: 2712.82, status: 'captured', method: 'upi', transactionId: 'TXN-2025-0001', capturedAt: nowPlusHours(-48) },
      { bookingRef: 'booking2', userRef: 'custBina', amount: 1117.76, status: 'captured', method: 'card', transactionId: 'TXN-2025-0002', capturedAt: nowPlusHours(-36) },
      { bookingRef: 'booking3', userRef: 'custChirag', amount: 1767.64, status: 'captured', method: 'netbanking', transactionId: 'TXN-2025-0003', capturedAt: nowPlusHours(-24) },
      { bookingRef: 'booking4', userRef: 'custDivya', amount: 1790.88, status: 'captured', method: 'upi', transactionId: 'TXN-2025-0004', capturedAt: nowPlusHours(-12) },
      { bookingRef: 'booking5', userRef: 'custEsha', amount: 6252.82, status: 'initiated', method: 'card', transactionId: 'TXN-2025-0005', capturedAt: null }
    ];

    for (const payment of paymentFixtures) {
      await trx('payments').insert({
        booking_id: bookingIds[payment.bookingRef],
        user_id: userIds[payment.userRef],
        amount: payment.amount,
        currency: 'INR',
        payment_method: payment.method,
        gateway_transaction_id: payment.transactionId,
        status: payment.status,
        captured_at: payment.capturedAt,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });
    }

    const walletTransactionFixtures = [
      { walletRef: 'custAlex', bookingRef: 'booking1', type: 'debit', amount: 200.0, balanceAfter: 250.5, remarks: 'Wallet deduction for booking BK25A001AZ01' },
      { walletRef: 'provIshan', bookingRef: 'booking1', type: 'credit', amount: 2040.0, balanceAfter: 2040.0, remarks: 'Payout for booking BK25A001AZ01' },
      { walletRef: 'custBina', bookingRef: 'booking2', type: 'debit', amount: 100.0, balanceAfter: 20.0, remarks: 'Wallet deduction for booking BK25A002BZ02' },
      { walletRef: 'provJyoti', bookingRef: 'booking2', type: 'credit', amount: 900.0, balanceAfter: 900.0, remarks: 'Payout for booking BK25A002BZ02' },
      { walletRef: 'provKaran', bookingRef: 'booking3', type: 'credit', amount: 1200.0, balanceAfter: 1200.0, remarks: 'Advance payout for booking BK25A003CY03' }
    ];

    for (const transaction of walletTransactionFixtures) {
      await trx('wallet_transactions').insert({
        wallet_id: walletIds[transaction.walletRef],
        booking_id: bookingIds[transaction.bookingRef],
        type: transaction.type,
        reference_type: 'booking',
        reference_id: bookingIds[transaction.bookingRef],
        amount: transaction.amount,
        balance_after: transaction.balanceAfter,
        remarks: transaction.remarks,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });
    }

    const reviewFixtures = [
      { bookingRef: 'booking1', customerRef: 'custAlex', providerRef: 'provIshan', rating: 5, reviewText: 'Outstanding deep cleaning with meticulous attention to detail.' },
      { bookingRef: 'booking2', customerRef: 'custBina', providerRef: 'provJyoti', rating: 4, reviewText: 'Quick turnaround and very professional service.' },
      { bookingRef: 'booking3', customerRef: 'custChirag', providerRef: 'provKaran', rating: 5, reviewText: 'Resolved complex plumbing issue within an hour.' },
      { bookingRef: 'booking4', customerRef: 'custDivya', providerRef: 'provLata', rating: 4, reviewText: 'Technicians arrived on time and serviced appliances well.' },
      { bookingRef: 'booking5', customerRef: 'custEsha', providerRef: 'provManoj', rating: 5, reviewText: 'Consultation was detailed; repaint scheduled next week.' }
    ];

    for (const review of reviewFixtures) {
      await trx('reviews').insert({
        booking_id: bookingIds[review.bookingRef],
        customer_id: userIds[review.customerRef],
        provider_id: serviceProviderIds[review.providerRef],
        rating: review.rating,
        review_text: review.reviewText,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });
    }

    const notificationFixtures = [
      { userRef: 'custAlex', title: 'Booking Confirmed', message: 'Your Spark Deep Clean Package is confirmed for 10 Jan.', type: 'booking', metadata: { bookingCode: 'BK25A001AZ01' } },
      { userRef: 'custBina', title: 'Invoice Available', message: 'Download invoice for your electrical diagnostics service.', type: 'payment', metadata: { bookingCode: 'BK25A002BZ02' } },
      { userRef: 'provLata', title: 'Service Reminder', message: 'Appliance tune-up scheduled today at 2 PM.', type: 'system', metadata: { bookingCode: 'BK25A004DX04' } },
      { userRef: 'svcMahesh', title: 'Ticket Escalated', message: 'Support ticket TKT2025A001Z requires attention.', type: 'support', metadata: { ticketCode: 'TKT2025A001Z' } },
      { userRef: 'supRaina', title: 'Daily Summary Ready', message: 'Review today’s booking and payment summary.', type: 'system', metadata: { reportDate: '2025-01-10' } }
    ];

    for (const notification of notificationFixtures) {
      await trx('notifications').insert({
        user_id: userIds[notification.userRef],
        title: notification.title,
        message: notification.message,
        type: notification.type,
        status: 'unread',
        metadata: notification.metadata,
        sent_via: 'in_app',
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });
    }

    const supportTicketFixtures = [
      {
        ref: 'ticket1',
        ticketCode: 'TKT2025A001Z',
        userRef: 'custAlex',
        assignedRef: 'svcMahesh',
        category: 'booking',
        priority: 'medium',
        status: 'open',
        subject: 'Reschedule deep cleaning',
        description: 'Need to move the deep cleaning appointment to the evening slot.',
        relatedBookingRef: 'booking1',
        relatedProviderRef: 'provIshan'
      },
      {
        ref: 'ticket2',
        ticketCode: 'TKT2025A002Y',
        userRef: 'custBina',
        assignedRef: 'svcNirali',
        category: 'payment',
        priority: 'high',
        status: 'in_progress',
        subject: 'Double charge on payment',
        description: 'Card statement shows duplicate charge for booking BK25A002BZ02.',
        relatedBookingRef: 'booking2',
        relatedProviderRef: 'provJyoti'
      },
      {
        ref: 'ticket3',
        ticketCode: 'TKT2025A003X',
        userRef: 'custChirag',
        assignedRef: 'svcOmkar',
        category: 'provider',
        priority: 'low',
        status: 'resolved',
        subject: 'Share plumbing invoice copy',
        description: 'Please share the PDF copy of invoice for annual maintenance.',
        relatedBookingRef: 'booking3',
        relatedProviderRef: 'provKaran'
      },
      {
        ref: 'ticket4',
        ticketCode: 'TKT2025A004W',
        userRef: 'custDivya',
        assignedRef: 'svcPrisha',
        category: 'technical',
        priority: 'urgent',
        status: 'in_progress',
        subject: 'App not loading past checkout',
        description: 'Checkout screen keeps spinning when confirming appliance service.',
        relatedBookingRef: 'booking4',
        relatedProviderRef: 'provLata'
      },
      {
        ref: 'ticket5',
        ticketCode: 'TKT2025A005V',
        userRef: 'custEsha',
        assignedRef: 'svcQadir',
        category: 'other',
        priority: 'medium',
        status: 'open',
        subject: 'Need GST invoice details',
        description: 'Kindly share GST details for painting service quotation.',
        relatedBookingRef: 'booking5',
        relatedProviderRef: 'provManoj'
      }
    ];

    const ticketIds = {};

    for (const ticket of supportTicketFixtures) {
      const [ticketId] = await trx('support_tickets').insert({
        ticket_code: ticket.ticketCode,
        user_id: userIds[ticket.userRef],
        assigned_to: userIds[ticket.assignedRef],
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        subject: ticket.subject,
        description: ticket.description,
        related_booking_id: bookingIds[ticket.relatedBookingRef],
        related_provider_id: serviceProviderIds[ticket.relatedProviderRef],
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });

      ticketIds[ticket.ref] = ticketId;
    }

    const ticketMessageFixtures = [
      { ticketRef: 'ticket1', senderRef: 'custAlex', message: 'Can we move the cleaning to after 5 PM?', attachments: [] },
      { ticketRef: 'ticket2', senderRef: 'custBina', message: 'Sharing bank snapshot for reference.', attachments: [{ type: 'image', url: 'https://example.com/screenshot1.png' }] },
      { ticketRef: 'ticket3', senderRef: 'svcOmkar', message: 'Invoice emailed to your registered address.', attachments: [] },
      { ticketRef: 'ticket4', senderRef: 'svcPrisha', message: 'Engineering team is investigating the checkout issue.', attachments: [] },
      { ticketRef: 'ticket5', senderRef: 'svcQadir', message: 'GST details attached for your review.', attachments: [{ type: 'pdf', url: 'https://example.com/gst-details.pdf' }] }
    ];

    for (const message of ticketMessageFixtures) {
      await trx('ticket_messages').insert({
        ticket_id: ticketIds[message.ticketRef],
        sender_id: userIds[message.senderRef],
        message: message.message,
        attachments: message.attachments.length ? message.attachments : null,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });
    }

    const refreshTokenFixtures = [
      { userRef: 'custAlex', hoursValid: 720 },
      { userRef: 'custBina', hoursValid: 720 },
      { userRef: 'provIshan', hoursValid: 720 },
      { userRef: 'svcMahesh', hoursValid: 720 },
      { userRef: 'supRaina', hoursValid: 720 }
    ];

    for (const tokenFixture of refreshTokenFixtures) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      await trx('refresh_tokens').insert({
        user_id: userIds[tokenFixture.userRef],
        token_hash: tokenHash,
        expires_at: nowPlusHours(tokenFixture.hoursValid),
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });
    }

    const passwordResetFixtures = [
      { userRef: 'custChirag', hoursValid: 24 },
      { userRef: 'custDivya', hoursValid: 24 },
      { userRef: 'provJyoti', hoursValid: 24 },
      { userRef: 'svcNirali', hoursValid: 24 },
      { userRef: 'supUdit', hoursValid: 24 }
    ];

    for (const reset of passwordResetFixtures) {
      const rawToken = crypto.randomBytes(16).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      await trx('password_reset_tokens').insert({
        user_id: userIds[reset.userRef],
        token_hash: tokenHash,
        expires_at: nowPlusHours(reset.hoursValid),
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      });
    }
  });
}
