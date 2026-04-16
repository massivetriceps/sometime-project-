const success = (res, data, message = 'success', status = 200) =>
  res.status(status).json({ success: true, message, data });

const fail = (res, message = 'error', status = 400) =>
  res.status(status).json({ success: false, message, data: null });

module.exports = { success, fail };
