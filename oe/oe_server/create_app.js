/**
 * Created by jfagan on 4/21/15.
 *
 */

var express = require('express');         // The web framework
var inspect = require('util').inspect;
var log = require('util').log;
var favicon = require('serve-favicon');

var app = express();
//app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', appRoot + '/oe');

// Session handling
require('./session_setup')(app);

// Specific paths to deal the the Backbone router
var sendOEApp = function (req, res, next) {
    log('Send the OE app');
    res.locals.inspect = inspect;
    res.render('index.ejs',
        {
            oe: {test: 'the test'},
            oeModules: oeModules
        });
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


