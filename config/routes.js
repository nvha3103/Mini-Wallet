/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
    'POST /api/auth/register': 'AccountController.register',
    'POST /api/auth/login': 'AccountController.login',
    'POST /api/auth/logout': 'AccountController.logout',

    'POST /api/wallet/overview': 'WalletController.overview',

    // 'POST /api/wallet/transfer': 'WalletController.transfer',

    'POST /api/wallet/transfer/request': 'WalletController.request',
    'POST /api/wallet/transfer/confirm': 'WalletController.confirm',
    'POST /api/wallet/transfer/detail': 'WalletController.detail',
    'POST /api/wallet/transfer/cancel': 'WalletController.cancel'
};
