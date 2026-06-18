const respCode = require('../services/respCode');

module.exports = function notFound(data) {
  const res = this.res;
  const payload = {
    err: respCode.NOT_FOUND,
    message: 'Not found'
  };

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    Object.assign(payload, data);
  } else if (data !== undefined) {
    payload.data = data;
  }

  return res.status(200).json(payload);
};
