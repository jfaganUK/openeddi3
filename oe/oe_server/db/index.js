/**
 * Created by jfagan on 3/25/15.
 * oe/oe_server/db/index.js
 */

var sequelize = require('./config');
var log = require('util').log;
var async = require('async');

module.exports = function (moduleCallback) {

    var models;
    // Attempt to authenticate with the server, if not, then throw an error
    var authDb = function (callback) {
        sequelize
            .authenticate()
            .then(function (err) {
                log("[db] Connection has been established successfully.");
                callback(null);
            })
            .catch(function (err) {
                log("[db] Unable to connect to the database:", err);
            });
    };

    var syncModels = function (callback) {
        // Grab the models for the database
        models = require('./models/_list');

        // Sync the models with the server
        sequelize.sync({ force: OEConfig.db.forceSync })
            .then(function (err) {
                log('[db] Server is synced.');
                callback(null);
            })
            .catch(function (err) {
                log('[db] An error occurred while creating the table: ', err.message);
                log(err.sql);
            });
    };

    async.series([authDb, syncModels], function (callback, results) {
        moduleCallback({ sequelize: sequelize, models: models });
    });
};







