const respCode = require("../services/respCode")
const bcrypt = require('bcrypt');
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
    // transfer: async function (req, res) {
    //     // console.log("Bat dau xu ly logic chuyen khoan")
    //     const accountId = req.session.accountId;
    //     // console.log("accountId", accountId)

    //     if (!accountId) {
    //         res.error(respCode.UNAUTHORIZED, message = "please login")
    //     }

    //     const pocketSend = await Pocket.findOne({
    //         account: accountId
    //     })
    //     // console.log("pocketSend", pocketSend)

    //     // console.log(req.body)

    //     const phoneNumberReceive = req.body.phoneNumber;
    //     const amountSend = req.body.amount;

    //     // console.log("phoneNumberReceive", phoneNumberReceive)
    //     // console.log("amountSend", amountSend)

    //     const accountReceiver = await Account.findOne({ phoneNumber: phoneNumberReceive })
    //     // console.log("accountReceiver", accountReceiver)

    //     if (accountReceiver.id === accountId) {
    //         res.error(message = "AccountReceiver is similar to accountSend")
    //     }

    //     const pocketReceiver = await Pocket.findOne({ account: accountReceiver.id })

    //     // console.log("pocketReceiver: ", pocketReceiver)

    //     if (amountSend < 0 || amountSend > pocketSend.balance) {
    //         return res.error({
    //             message: "So tien khong hop le"
    //         })
    //     } else {
    //         // console.log("Bat dau thuc hien logic chuyen tien")
    //         const send = await Pocket.updateOne({ account: accountId }, {
    //             balance: parseInt(pocketSend.balance) - parseInt(amountSend)
    //         })
    //         // console.log("send", send)
    //         const receiver = await Pocket.updateOne({ account: accountReceiver.id }, {
    //             balance: parseInt(pocketReceiver.balance) + parseInt(amountSend)
    //         })
    //         // console.log("receiver", receiver)
    //         return res.ok({
    //             message: `Transfer to account with id: ${accountReceiver.id} is success`
    //         })
    //     }
    // }

    request: async function (req, res) {
        const accountId = req.session.accountId;
        if (!accountId) {
            res.error(respCode.UNAUTHORIZED, message = "please login")
        }

        const phoneNumberReceive = req.body.phoneNumber;
        const amountSend = req.body.amount;

        const accountReceiver = await Account.findOne({ phoneNumber: phoneNumberReceive })

        if (accountReceiver.id === accountId) {
            res.error(message = "AccountReceiver is similar to accountSend")
        }

        const pocketSend = await Pocket.findOne({ account: accountId })

        const pocketReceiver = await Pocket.findOne({ account: accountReceiver.id })

        if (pocketSend.balance === 0) {
            return res.error({
                message: "So tien khong hop le"
            })
        }

        const transaction = await Transaction.create({
            status: "pending",
            sender: accountId,
            receiver: accountReceiver.id,
            failedAttempts: 0,
            confirmedAt: null,
            amount: amountSend,
            expiresAt: Date.now() + 5 * 60 * 1000
        }).fetch();

        if (transaction) {
            return res.ok({
                message: "Transfer request created",
                transaction
            })
        }
    },

    detail: async function (req, res) {
        const transactionId = req.body.transactionId;
        const accountId = req.session.accountId;

        const transaction = await Transaction.findOne({ id: transactionId })
        if (accountId !== transaction.sender) {
            return res.error(respCode.UNAUTHORIZED, "")
        }

        return res.ok({
            message: "Tim thay transaction",
            transaction
        })
    },

    confirm: async function (req, res) {
        console.log("logic xu ly confirm:....")

        const transactionId = req.body.transactionId;
        console.log("transactionId: ", transactionId)

        const personalCode = req.body.personalCode;
        console.log("personalCode: ", personalCode)

        const accountId = req.session.accountId;

        if (!accountId) {
            return res.ok({
                message: "Please Login"
            })
        }

        const transaction = await Transaction.findOne({ id: transactionId });
        console.log("transaction", transaction)

        const amountSend = transaction.amount;
        console.log('amountSend', amountSend)

        const accountReceiver = await Account.findOne({ id: transaction.receiver })
        console.log("accountReceiver", accountReceiver)

        const account = await Account.findOne({ id: accountId })

        const pocketSend = await Pocket.findOne({ account: accountId })
        const pocketReceiver = await Pocket.findOne({ account: accountReceiver.id })

        const isMatched = await bcrypt.compare(personalCode, account.personalCode);
        console.log(isMatched)

        if (isMatched) {
            console.log("Bat dau tru tien");
            const send = await Pocket.updateOne({ account: accountId }, {
                balance: parseInt(pocketSend.balance) - parseInt(amountSend)
            })
            console.log("send", send)
            const receiver = await Pocket.updateOne({ account: accountReceiver.id }, {
                balance: parseInt(pocketReceiver.balance) + parseInt(amountSend)
            })
            console.log("receiver", receiver)
        } else {
            return res.ok({
                message: "PersonalCode is incorrect"
            })
        }

        console.log("Ket thuc logic confirm.....")

        return res.ok({
            message: "Transfer successfull",
            transaction: transaction
        })
    }

};
