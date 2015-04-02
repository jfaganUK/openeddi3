/**
 * Created by jfagan on 3/24/15.
 * oe/oe_server/api/api-responses.js
 */

var responses = require('./controllers/controller-response');

module.exports = function (router) {
    // Get all the responses for a given puid
    router.route('/responses/:poolid/:puid')
        .get(responses.getall);

    // Manage the individual responses
    router.route('/responses/:poolid/:puid/:eid')
        .get(responses.get)
        .put(responses.put)
        .post(responses.post)
        .delete(responses.delete);

    router.route('/responses')
        .get(function (req, res) {
            res.json({message: "the responses api is here"});
        });
    router.route('/responses/:poolid')
        .get(function (req, res) {
            res.json({message: "you asked for poolid: " + req.params.poolid});
        });
};