const respCode = require("../services/respCode")
module.exports = {
    //[POST] /api/wallet/overview
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
    },

    //[POST] /api/wallet/transfer
    transfer: async function (req, res) {
        console.log("Bat dau xu ly logic chuyen khoan")
        const accountId = req.session.accountId;
        console.log("accountId", accountId)
        if (!accountId) {
            res.error(respCode.UNAUTHORIZED, message = "please login")
        }

        const pocketSend = await Pocket.findOne({
            account: accountId
        })
        console.log("pocketSend", pocketSend)

        console.log(req.body)

        const phoneNumberReceive = req.body.phoneNumber;
        const amountSend = req.body.amount;

        console.log("phoneNumberReceive", phoneNumberReceive)
        console.log("amountSend", amountSend)

        const accountReceiver = await Account.findOne({ phoneNumber: phoneNumberReceive })
        console.log("accountReceiver", accountReceiver)

        if (accountReceiver.id === accountId) {
            res.error(message = "AccountReceiver is similar to accountSend")
        }

        const pocketReceiver = await Pocket.findOne({ account: accountReceiver.id })

        console.log("pocketReceiver: ", pocketReceiver)

        if (amountSend < 0 || amountSend > pocketSend.balance) {
            return res.error({
                message: "So tien khong hop le"
            })
        } else {
            console.log("Bat dau thuc hien logic chuyen tien")
            const send = await Pocket.updateOne({ account: accountId }, {
                balance: parseInt(pocketSend.balance) - parseInt(amountSend)
            })
            console.log("send", send)
            const receiver = await Pocket.updateOne({ account: accountReceiver.id }, {
                balance: parseInt(pocketReceiver.balance) + parseInt(amountSend)
            })
            console.log("receiver", receiver)
            return res.ok({
                message: `Transfer to account with id: ${accountReceiver.id} is success`
            })
        }



    }

};
