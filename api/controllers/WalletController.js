const respCode = require("../services/respCode")
const bcrypt = require('bcrypt');
const { ObjectId } = require("mongodb")
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
            return res.error(respCode.UNAUTHORIZED, message = "please login")
        }

        const phoneNumberReceive = req.body.phoneNumber;
        const amountSend = req.body.amount;

        const accountReceiver = await Account.findOne({ phoneNumber: phoneNumberReceive })
        if (!accountReceiver) {
            return res.error({
                message: "accountRêciver is undefined "
            })
        }

        if (accountReceiver.id === accountId) {
            return res.error(message = "AccountReceiver is similar to accountSend")
        }

        const pocketSend = await Pocket.findOne({ account: accountId })


        const pocketReceiver = await Pocket.findOne({ account: accountReceiver.id })

        if (pocketSend.balance === 0) {
            return res.error({
                message: "Balance isn't enough to transfer"
            })
        }

        if (amountSend <= 0 || amountSend > pocketSend.balance) {
            return res.error({
                message: "Amount is not valid"
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
                transaction,
                pocketSend
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
        // console.log("logic xu ly confirm:....")

        const transactionId = req.body.transactionId;
        // console.log("transactionId: ", transactionId)

        const personalCode = req.body.personalCode;
        // console.log("personalCode: ", personalCode)

        const accountId = req.session.accountId;

        if (!accountId) {
            return res.error(respCode.UNAUTHORIZED, "Please Login")
        }

        if (!transactionId) {
            return res.error(respCode.BAD_REQUEST, "transactionId is required")
        }

        if (!/^\d{6}$/.test(personalCode)) {
            return res.error(respCode.BAD_REQUEST, "personalCode must have 6 digit")
        }

        const transaction = await Transaction.findOne({ id: transactionId });
        if (!transaction) {
            return res.error(respCode.NOT_FOUND, "transaction not found")
        }

        if (transaction.sender !== accountId) {
            return res.error(
                respCode.NOT_FOUND,
                "accountId and transaction sender is not similar"
            )
        }

        if (Number(transaction.expiresAt) <= Date.now()) {
            await Transaction.updateOne({
                id: transactionId,
                status: "pending"
            }).set({
                status: "expired"
            })
            return res.error(respCode.BAD_REQUEST, "transaction has expired")
        }

        if (transaction.status !== "pending") {
            return res.error(respCode.BAD_REQUEST, "het han chuyen khoan")
        }

        const amountSend = transaction.amount;
        if (!Number(amountSend) || amountSend < 0) {
            return res.error(respCode.BAD_REQUEST, "amountSend is invalid")
        }

        const accountReceiver = await Account.findOne({ id: transaction.receiver })
        const account = await Account.findOne({ id: accountId })

        if (!account || !accountReceiver) {
            return res.error(
                respCode.NOT_FOUND,
                "Account not found"
            )
        }
        const isMatched = await bcrypt.compare(personalCode, account.personalCode);
        // console.log(isMatched)

        if (isMatched) {
            // // console.log("Bat dau tru tien");
            // const send = await Pocket.updateOne({ account: accountId }).set({
            //     balance: parseInt(pocketSend.balance) - parseInt(amountSend)
            // })

            // if (!send) {
            //     return res.error(respCode.SERVER_ERROR, "Cannot update sender pocket");
            // }
            // // console.log("send", send)
            // const receiver = await Pocket.updateOne({ account: accountReceiver.id }).set({
            //     balance: parseInt(pocketReceiver.balance) + parseInt(amountSend)
            // })

            // if (!receiver) {
            //     return res.error(respCode.SERVER_ERROR, "Cannot update receiver pocket");
            // }
            // // console.log("receiver", receiver)

            // const newTransaction = await Transaction.updateOne({ id: transactionId, status: "pending" }).set({
            //     status: "success",
            //     confirmedAt: Date.now()
            // })

            // return res.ok({
            //     message: "Transfer successfull",
            //     transaction: newTransaction
            // })
            const db = sails.getDatastore().manager;
            const session = db.client.startSession();

            const transactionTab = db.collection(Transaction.tableName);
            const pocketTab = db.collection(Pocket.tableName);
            const accountTab = db.collection(Account.tableName);

            try {
                await session.withTransaction(async () => {
                    // Các thao tác database được đặt ở đây.
                    const transactionObjectId = new ObjectId(transactionId);
                    const senderObjectId = new ObjectId(accountId);

                    const currentTransaction = await transactionTab.findOne({
                        _id: transactionObjectId,
                        sender: senderObjectId,
                        status: "pending",
                        expiresAt: { $gt: Date.now() }
                    }, { session });

                    if (!currentTransaction) {
                        throw new Error("Transaction is invalid, expired or already confirmed");
                    }

                    const amount = Number(currentTransaction.amount);
                    const receiverObjectId = currentTransaction.receiver;

                    if (amount <= 0) {
                        throw new Error("Invalid amount");
                    }

                    if (senderObjectId.equals(receiverObjectId)) {
                        throw new Error("Cannot transfer to your own account");
                    }

                    const receiverAccount = await accountTab.findOne({
                        _id: receiverObjectId
                    }, { session })

                    if (!receiverAccount) {
                        throw new Error("receiver acoount not found")
                    }

                    const debitResult = await pocketTab.updateOne({
                        account: senderObjectId,
                        status: "active",
                        balance: { $gte: amount }
                    }, {
                        $inc: { balance: -amount },
                        $set: { updatedAt: Date.now() }
                    }, { session })

                    if (debitResult.modifiedCount !== 1) {
                        throw new Error("Balance is not enough")
                    }

                    const creditResult = await pocketTab.updateOne({
                        account: receiverObjectId,
                        status: "active"
                    }, {
                        $inc: { balance: amount },
                        $set: { updatedAt: Date.now() }
                    }, { session })

                    if (creditResult.modifiedCount !== 1) {
                        throw new Error("Cannot update receiver pocket");
                    }

                    const completedRes = await transactionTab.updateOne({
                        _id: transactionObjectId,
                        status: "pending"
                    }, {
                        $set: {
                            status: "success",
                            confirmedAt: Date.now(),
                            updatedAt: Date.now()
                        }
                    }, { session })
                    if (completedRes.modifiedCount !== 1) {
                        throw new Error("Cannot complete transaction");
                    }
                });

                const confirmedTransaction = await Transaction.findOne({ id: transactionId })
                return res.ok({
                    message: "Transfer successfully",
                    transaction: confirmedTransaction
                })
            } catch (error) {
                return res.error(
                    respCode.BAD_REQUEST,
                    error.message || "Transfer failed"
                );
            } finally {
                await session.endSession();
            }

        } else {
            await Transaction.updateOne({ id: transactionId }).set({ failedAttempts: transaction.failedAttempts + 1 })
            return res.error(
                respCode.UNAUTHORIZED,
                "Personal code is incorrect"
            )
        }

        // console.log("Ket thuc logic confirm.....")


    }

};
