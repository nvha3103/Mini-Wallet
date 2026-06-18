module.exports = {
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        price: {
            type: 'number',
            required: true,
            min: 0
        },
        stock: {
            type: 'number',
            required: true,
            min: 0
        },
        description: {
            type: 'string',
            allowNull: true
        }
    }
}