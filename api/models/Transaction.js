module.exports = {
    attributes: {
        sender: {
            model: 'account',
            required: true,
        },
        receiver: {
            model: 'account',
            required: true,
        },
        amount: {
            type: 'number',
            required: true,
            min: 1
        },
        status: {
            type: 'string',
            defaultsTo: 'pending',
            isIn: ['pending', 'success', 'failed', 'expired', 'cancelled']
        },
        failedAttempts: {
            type: 'number',
            defaultsTo: 0,
            min: 0
        },
        confirmedAt: {
            type: 'number',
            allowNull: true
        },
        expiresAt: {
            type: 'number',
            allowNull: true
        }
    }
}