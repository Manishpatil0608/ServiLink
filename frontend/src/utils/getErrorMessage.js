const extractCelebrateMessage = (data) => {
  if (!data?.validation) {
    return null;
  }

  const segments = Object.values(data.validation);
  for (const segment of segments) {
    if (Array.isArray(segment?.details) && segment.details.length > 0) {
      const message = segment.details[0]?.message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }
    }
  }

  return null;
};

const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) {
    return fallback;
  }

  const data = error?.response?.data;
  const apiMessage = data?.error?.message;
  if (apiMessage) {
    return apiMessage;
  }

  if (typeof data?.message === 'string' && data.message.trim().length > 0) {
    return data.message;
  }

  const celebrateMessage = extractCelebrateMessage(data);
  if (celebrateMessage) {
    return celebrateMessage;
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};

export default getErrorMessage;
