module.exports = {
    attributes: {
        account: {
            model: 'account',
            required: true,
            unique: true
        },
        balance: {
            type: 'number',
            defaultsTo: 1000000,
            min: 0
        },
        status: {
            type: 'string',
            defaultsTo: "active"
        }
    }
}