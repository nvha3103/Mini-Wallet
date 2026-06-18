const respCode = require('../services/respCode');

module.exports = function ok(data) {
  const res = this.res;
  const payload = {
    err: respCode.OK,
    message: 'Success'
  };

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    Object.assign(payload, data);
  } else if (data !== undefined) {
    payload.data = data;
  }

  return res.status(200).json(payload);
};
