const bcrypt = require('bcrypt');
const respCode = require('../services/respCode');

module.exports = {
    register: async function (req, res) {
        console.log("Bắt đầu đăng kí tài khoản")

        const { fullName, phoneNumber, email, password, personalCode } = req.body;

        if (!fullName || !email || !password || !phoneNumber) {
            return res.badRequest({
                message: 'fullName, email, phoneNumber and password are required'
            })
        }

        const existedPhoneNumber = await Account.findOne({ phoneNumber })
        if (existedPhoneNumber) {
            return res.error(respCode.DUPLICATED, 'Phone has been used to create account')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const hashedPersonalCode = await bcrypt.hash(personalCode, 10)
        const account = await Account.create({ fullName, phoneNumber, password: hashedPassword, email, personalCode: hashedPersonalCode }).fetch()

        // if (pocket) {
        //     console.log("Đã tạo tài khoản thành công")
        // }

        const pocket = await Pocket.create({
            account: account.id
        }).fetch()

        // if (pocket) {
        //     console.log("Đã tạo ví thành công")
        // }

        delete account.password;
        delete account.personalCode;

        return res.ok({
            message: 'Register successfully',
            account,
            pocket
        })
    },

    login: async function (req, res) {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            return res.badRequest({ message: 'phoneNumber and password are required' });
        }

        const account = await Account.findOne({
            phoneNumber
        })

        if (!account) {
            return res.error(respCode.UNAUTHORIZED, 'Phone number or password is incorrect')
        }

        const isMatched = await bcrypt.compare(password, account.password)

        if (!isMatched) {
            return res.error(respCode.UNAUTHORIZED, 'Phone number or password is incorrect')
        }

        req.session.accountId = account.id
        delete account.password;
        delete account.personalCode;

        return res.ok({
            message: 'Login successfully',
            account
        })
    },

    logout: async function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                return res.serverError(err);
            }

            res.clearCookie('sails.sid');

            return res.ok({
                message: 'Logout successfully'
            });
        });

    }
}
