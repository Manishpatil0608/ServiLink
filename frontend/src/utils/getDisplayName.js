const getDisplayName = (user) => {
  if (!user) {
    return '';
  }
  const parts = [user.first_name, user.last_name].filter(Boolean);
  if (parts.length) {
    return parts.join(' ');
  }
  if (user.email) {
    return user.email;
  }
  if (user.phone) {
    return user.phone;
  }
  return '';
};

export default getDisplayName;
