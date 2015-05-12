/**
 * Created by jfagan on 4/21/15.
 *
 */

var session = require('express-session'); // To manage user sessions

module.exports = function (app) {
// TODO: (jfagan) come up with a better secret
    app.use(session({
        gendid: function (req) {
            return genuuid()
        },
        secret: 'OpenEddi',
        resave: true,
        saveUninitialized: true,
        cookie: {
            httpOnly: false,
            secure: true
        }
    }));

    return app;
};
