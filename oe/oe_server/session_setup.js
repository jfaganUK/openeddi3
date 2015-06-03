/**
 * Created by jfagan on 4/21/15.
 * NOTE: not using this specific file. Trying to keep all this code just directly in the create_app file
 */

var session = require('express-session'); // To manage user sessions
var cookieParser = require('cookie-parser');
var pgSession = require('connect-pg-simple')(session);
var pg = require('pg');

module.exports = function (app) {
    // TODO (jfagan): come up with a better secret
    // TODO (jfagan): implement a storage with postgres (connect-pg-simple seems like a workable option)
    app.use(cookieParser());
    app.use(session({
        store: new pgSession({
            pg: pg,
            conString: 'postgresql://' + OEConfig.db.username + ':' + OEConfig.db.password + '@localhost/' + OEConfig.db.database,
            tableName: 'session'
        }),
        //store: new (require('connect-pg-simple')(session))(),
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
