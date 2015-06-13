/**
 * Created by jfagan on 6/11/15.
 * oe/oe_server/api/api-admin-pool-listings.js:3
 */

var poolListings = require('./controllers/controller-admin-pool-listings');

module.exports = function (router) {
    router.route('/poollistings')
        .get(poolListings.getAll);
};