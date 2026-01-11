const durationPattern = /^(\d+)([smhd])$/;

const multiplier = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000
};

export const durationToMs = (ttl) => {
  if (typeof ttl === 'number') {
    return ttl;
  }

  const match = `${ttl}`.trim().toLowerCase().match(durationPattern);
  if (!match) {
    throw new Error(`Unsupported duration format: ${ttl}`);
  }

  const value = Number(match[1]);
  const unit = match[2];
  return value * multiplier[unit];
};
