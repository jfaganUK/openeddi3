/**
 * Created by jfagan on 3/6/15.
 * server.js
 */

var path = require('path');
global.appRoot = path.resolve(__dirname);

var _ = require('lodash');                // For some functional programming
var fs = require('fs');                   // For using the file system.
var log = require('util').log;            // For better logging (with timestamps)
var inspect = require('util').inspect;
var async = require('async');
var bcrypt = require('bcryptjs');

// Load the configuration file
global.OEConfig = null;
var loadConfig = function (callback) {
    log('[startup] Loading config file.');
    fs.readFile('./oe/config.json', function (err, data) {
        OEConfig = JSON.parse(data);
        callback(err);
    });
};

// Load the Eddi modules
global.oeModules = null;
var loadEddiModules = function (callback) {
    log('[startup] Loading eddi modules');

    require('./oe/oe_server/load-oe-module-information')(function (d) {
        oeModules = d;
        callback(null);
    });
};

// Set up the database
var sequelize, models;
var setupDatabase = function (callback, results) {
    log('[startup] Preparing the database');
    function dbThen(db) {
        sequelize = db.sequelize;
        models = db.models;
        callback(null);
    }

    require('./oe/oe_server/db')(dbThen);
};

// The Express app and all the routes and such
var app;
var getExpressApp = function (callback) {
    log('[startup] Creating express application');
    app = require('./oe/oe_server/create_app');
    callback(null);
};

// Create admin user
var createAdminUser = function (callback) {
    var User = models.User;
    var admin = OEConfig.adminAccount;
    admin.pwd = bcrypt.hashSync(admin.password);

    User.findOrCreate({
        where: {username: admin.username},
        defaults: {
            pwd: admin.pwd,
            email: admin.email,
            fname: admin.firstName,
            lname: admin.lastName
        }
    })
        .then(function (user) {
            log('[createAdminUser] Admin user created');
            callback(null);
        });
};

// Get the list of the oe pools and double-check that they have a db entry in PoolDesign
function syncPoolListings(callback) {

    var path = appRoot + '/oe/oe_pools/';
    var poolListings = [];
    var pools = {};
    var ModelPoolDesign = models.PoolDesign;

    var dirs = fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });

    _.forEach(dirs, function (d) {
        var jsonFile = path + d + '/pool.json';
        // Has to by Sync otherwise I get empty returns some times.
        var jsonRead = fs.readFileSync(jsonFile, 'utf8');
        var jsonData = JSON.parse(jsonRead);
        pools[jsonData.poollogic.poolid] = jsonData;
        
        ModelPoolDesign.findOrCreate({
            where: {poolid: jsonData.poollogic.poolid},
            defaults: {
                poolid: jsonData.poollogic.poolid,
                poollogic: jsonData,
                username: jsonData.poollogic.username,
                meta: jsonData.poollogic.meta,
                dateInserted: jsonData.poollogic.dateInserted,
                updatedAt: jsonData.poollogic.updatedAt
            }
        });

    });
    log('[syncPoolListings] PoolDesign entries created');
    callback(null);
    
}

// Compile the application - or not
var compileAppFile = function (callback) {
    if (OEConfig.build.build) {
        require('./openeddi-build')(callback);
    } else {
        callback(null);
    }
};

// The oe_server start queue
var startServerQueue = [loadConfig, loadEddiModules, setupDatabase, syncPoolListings, getExpressApp, createAdminUser, compileAppFile];

// 3.. 2.. 1.. Launch!
async.series(startServerQueue, function (err, results) {
    if (err) {
        log(err);
    } else {
        app.listen(OEConfig.appPort, '0.0.0.0');
        log('[startup] Listening on port ' + OEConfig.appPort);
    }
});








