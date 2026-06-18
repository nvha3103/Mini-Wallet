const respCode = require('../services/respCode');

module.exports = function error(err, message, data) {
  const res = this.res;
  const payload = {
    err: err || respCode.SERVER_ERROR,
    message: message || 'Error'
  };

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    Object.assign(payload, data);
  } else if (data !== undefined) {
    payload.data = data;
  }

  return res.status(200).json(payload);
};
