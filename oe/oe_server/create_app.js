/**
 * Created by jfagan on 4/21/15.
 * oe/oe_server/create_app.js
 */

var express = require('express');         // The web framework
var inspect = require('util').inspect;
var csrf = require('csurf');
var log = require('util').log;
var session = require('express-session'); // To manage user sessions
var cookieParser = require('cookie-parser');
var pgSession = require('connect-pg-simple')(session);
var pg = require('pg');
var guid = require('./helpers/guid');

var app = express();
//app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', appRoot + '/oe');

// Session handling
//app = require('./session_setup')(app);

app.use(cookieParser());
(function prepareSession() {
    log('[prepareSession] Creating the session store');
    var pgConnection = 'pg://' + OEConfig.db.username + ':' + OEConfig.db.password + '@localhost/' + OEConfig.db.database
    pg.connect(pgConnection, function (err, client, done) {
        var qry;
        if (err) {
            return console.error('error using the database');
        }

        qry = 'select exists (select 1 from information_schema.tables where table_name = \'session\');';
        client.query(qry, function (err, result) {
            if (err) {
                return console.error('[prepareSession] Unable to test if session table exists.');
            }
            if (result.rows[0].exists === false) {
                qry = 'CREATE TABLE IF NOT EXISTS "session" ( "sid" varchar NOT NULL COLLATE "default", "sess" json NOT NULL, "expire" timestamp(6) NOT NULL) WITH (OIDS=FALSE); ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;';
                client.query(qry, function (err, result) {
                    if (err) {
                        return console.error('[prepareSession] Failed to run table query!', err);
                    }
                });
            }
        });

    });
    app.use(session({
        store: new pgSession({
            pg: pg,
            conString: pgConnection,
            tableName: 'session'
        }),
        //store: new (require('connect-pg-simple')(session))(),
        genid: function () {
            return guid();
        },
        secret: 'OpenEddi',
        resave: true,
        saveUninitialized: true,
        cookie: {
            path: '/',
            httpOnly: false,
            secure: false,
            maxAge: null
        }
    }));
})();

// Cross site request forgery prevention!
//app.use(csrf());

// Specific paths to deal the the Backbone router
app.locals.inspect = inspect;
var sendOEApp = function (req, res, next) {
    log('Send the OE app');
    if (req.session.visits) {
        req.session.visits++;
    } else {
        req.session.visits = 1;
    }
    log('[sendOEApp] Visits: ' + req.session.visits);
    res.sendFile('./oe/vulcanized-app.html');
    //res.render('index.ejs',
    //    {
    //        //csrfToken: req.csrfToken(),
    //        csrfToken: '',
    //        oe: {test: 'the test'},
    //        oeModules: oeModules
    //    });
};
// Make sure to send the OE *only* if the route is / and no other
app.use(/\/$/, sendOEApp);
app.use('/pool/*', sendOEApp);

// Set up the api routes
require('./api/index')(app);

// Paths to different resources
app.use('/oe_client', express.static(appRoot + '/oe/oe_client'));
app.use('/bower_components/', express.static(appRoot + '/oe/bower_components'));
app.use('/oe_modules', express.static(appRoot + '/oe/oe_modules'));
app.use('/built.js', express.static(appRoot + '/built.js'));
app.use('/oe.css', express.static(appRoot + '/oe/oe_client/oe.css'));
app.use('/css', express.static(appRoot + '/oe/oe_client/css'));
app.use('/demo', express.static(appRoot + '/oe/oe_client/components/demo-oe-eddi-promptbar.html'));
app.use('/favicon.ico', express.static(appRoot + '/oe/oe_client/favicon.ico'));
app.use('/assets', express.static(appRoot + '/oe/oe_client/assets'));

// NOTE: do these two routes last.
// The catch for oe_server errors
app.use(function (err, req, res, next) {
    if (!err) {
        return next();
    } else {
        res.status(500).send('Something broke!');
        console.error(err);
    }
});

// When a page is not found...
app.use(function (err, req, res, next) {
    if (err.status !== 404) {
        return next();
    }
    res.status(404).send('Page not found');
});

module.exports = app;


