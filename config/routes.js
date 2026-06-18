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
    'GET /api/products': 'ProductController.list',
    'GET /api/products/search': 'ProductController.search',
    'GET /api/products/sort': 'ProductController.sort',
    'GET /api/products/:id': 'ProductController.findOne',
    'POST /api/products': 'ProductController.create',
    'PATCH /api/products/:id': 'ProductController.update',
    'DELETE /api/products/:id': 'ProductController.destroy',

    'POST /api/auth/register': 'AccountController.register',
    'POST /api/auth/login': 'AccountController.login',
    'POST /api/auth/logout': 'AccountController.logout'
};
