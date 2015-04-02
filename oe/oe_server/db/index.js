/**
 * Created by jfagan on 3/25/15.
 * oe/oe_server/db/index.js
 */

var sequelize = require('./config');
var log = require('util').log;

// Attempt to authenticate with the server, if not, then throw an error
sequelize
    .authenticate()
    .complete(function(err) {
        if(!!err) {
            log("DB: Unable to connect to the database:",err);
        } else {
            log("DB: Connection has been established successfully.");
        }
    });

// Grab the models for the database
var models = require('./models/_list');

// Sync the models with the server
sequelize.sync({force: false})
    .complete(function (err) {
        if (!!err) {
            log('DB: An error occurred while creating the table: ', err);
        } else {
            log('DB: Server is synced.');
        }
    });

