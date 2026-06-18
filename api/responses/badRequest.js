const respCode = require('../services/respCode');

module.exports = function badRequest(data) {
  const res = this.res;
  const payload = {
    err: respCode.BAD_REQUEST,
    message: 'Bad request'
  };

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    Object.assign(payload, data);
  } else if (data !== undefined) {
    payload.data = data;
  }

  return res.status(200).json(payload);
};
