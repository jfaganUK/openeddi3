/**
 * Created by jfagan on 5/31/15.
 * oe/oe_server/api/api-user-auth.js:3
 */

var auth = require('./controllers/controller-auth');

module.exports = function (router) {

    // There is only GET. The normal user API will be
    // used for listing, added, removing users.
    // This is just for authenticating users who attempt to log in.
    router.route('/auth/:userid')
        .get(auth.get);
    router.route('/auth/login')
        .post(auth.login);
};