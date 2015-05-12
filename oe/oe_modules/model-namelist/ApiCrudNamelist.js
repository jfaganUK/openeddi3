/**
 * Created by jfagan on 4/27/15.
 * oe/oe_modules/model-namelist/ApiCrudNamelist.js
 */

var namelist = require('./ApiNamelistController');

module.exports = function (router) {
    router.route('/namelist/:puid')
        .get(namelist.getall);

    router.route('/namelist/:puid/:id')
        .get(namelist.get)
        .put(namelist.put)
        .post(namelist.post)
        .delete(namelist.delete);
};