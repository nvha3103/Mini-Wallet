module.exports = {
    attributes: {
        fullName: {
            type: 'string',
            required: true
        },
        phoneNumber: {
            type: 'string',
            required: true,
            unique: true
        },
        email: {
            type: 'string',
            required: true
        },
        password: {
            type: 'string',
            required: true
        }
    }
}