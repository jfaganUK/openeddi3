/**
 * Created by jfagan on 6/13/15.
 *
 */

var responseTables = require('./controllers/controller-response-tables');

module.exports = function (router) {
    router.route('/responsetables/:poolid')
        .get(responseTables.getTables);
};
