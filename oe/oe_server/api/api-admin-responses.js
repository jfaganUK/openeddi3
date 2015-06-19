/**
 * Created by jfagan on 6/18/15.
 * oe/oe_server/api/api-admin-responses.js
 */

var responses = require('./controllers/controller-admin-get-responses');

module.exports = function (router) {
    router.route('/responses/:poolid/:table')
        .get(responses.getAdminResponses);

    router.route('/responses-csv/:poolid/:table')
        .get(responses.getAdminResponsesCSV);
};