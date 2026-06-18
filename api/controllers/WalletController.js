const respCode = require("../services/respCode")
module.exports = {
    overview: async function (req, res) {

        const accountId = req.session.accountId;

        if (!accountId) {
            return res.error(respCode.UNAUTHORIZED, 'please login')
        }

        const pocket = await Pocket.findOne({
            account: accountId
        })

        if (pocket) {
            return res.ok({
                message: `Hien thi thanh cong vi cua user ${accountId}`,
                pocket
            })
        } else {
            return res.error(respCode.NOT_FOUND, "Pocket not found")
        }
    }
};
