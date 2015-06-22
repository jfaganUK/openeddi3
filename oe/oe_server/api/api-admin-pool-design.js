/**
 * Created by jfagan on 6/22/15.
 *
 */

var poolDesign = require('./controllers/controller-admin-pool-design');

module.exports = function (router) {
    router.route('/pooldesign/:poolid')
        .get(poolDesign.getTopPoolDesign)
        .put(poolDesign.putPoolDesign);
};