/**
 * Created by jfagan on 3/25/15.
 *
 */

var poolListings = require('./controllers/pool-listings');

module.exports = function(router) {
    router.route('/poollistings')
        .get(poolListings.get);
};

