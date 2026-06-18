const respCode = require('../services/respCode');

module.exports = function serverError(data) {
  const res = this.res;
  const payload = {
    err: respCode.SERVER_ERROR,
    message: 'Server error'
  };

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    payload.message = data.message || payload.message;
  } else if (typeof data === 'string') {
    payload.message = data;
  }

  return res.status(200).json(payload);
};
