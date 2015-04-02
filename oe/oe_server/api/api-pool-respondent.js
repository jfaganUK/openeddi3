/**
 * Created by jfagan on 3/29/15.
 * oe/oe_server/api/api-pool-respondent.js
 */

var pool = require('./controllers/controller-pools');

module.exports = function (router) {

    // Get the pool
    router.route('/pool/:poolid/:puid')
        .post(pool.post)         // Create
        .get(pool.get)           // Retrieve
        .put(pool.put)           // Update
        .delete(pool.delete);    // Delete
};