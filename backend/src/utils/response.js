export const sendSuccess = (res, data, meta = null, status = 200) => {
  return res.status(status).json({ success: true, data, meta });
};
