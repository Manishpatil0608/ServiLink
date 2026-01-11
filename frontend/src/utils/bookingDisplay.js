const formatBookingSchedule = (value) => {
  if (!value) {
    return 'Schedule pending';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Schedule pending';
  }
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

const getBookingStatusLabel = (status) => {
  if (!status) {
    return 'Pending';
  }
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getBookingStatusClassName = (status) => {
  switch (status) {
    case 'confirmed':
    case 'in_progress':
      return 'text-emerald-600';
    case 'completed':
      return 'text-slate-600';
    case 'cancelled':
    case 'refunded':
      return 'text-rose-600';
    default:
      return 'text-amber-600';
  }
};

const formatBookingAmount = (amount) => {
  if (amount === null || amount === undefined) {
    return '—';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const buildBookingAddressPreview = (address) => {
  if (!address) {
    return 'Address not provided';
  }
  const parts = [address.line1, address.city, address.state, address.postalCode].filter(Boolean);
  if (parts.length === 0) {
    return 'Address not provided';
  }
  return parts.join(', ');
};

export {
  formatBookingSchedule,
  getBookingStatusLabel,
  getBookingStatusClassName,
  formatBookingAmount,
  buildBookingAddressPreview
};
