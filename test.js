/**
 * Created by jfagan on 6/13/15.
 *
 */

/**
 * Created by jfagan on 3/6/15.
 * server.js
 */

var path = require('path');
global.appRoot = path.resolve(__dirname);

var appPort = 4444;                       // The port the server runs on.
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
    fs.readFile(appRoot + '/oe/config.json', function (err, data) {
        if (err) {
            console.log(err);
        }
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

// Start the oe_server
var startServerQueue = [loadConfig, loadEddiModules, setupDatabase, getExpressApp, createAdminUser];
async.series(startServerQueue, function (err, results) {
    log('[startup] Ready for test!');
    testing();
});

/**********************************************************************/

function testing() {
    var f = require('./oe/oe_modules/control-checklist/ResponseTable.js');

    f('elph', {
        "eid": "102",
        "sheetid": "1",
        "poolid": "elph",
        "sortIndex": 0,
        "title": "workDrugs",
        "controlmodule": "checklist",
        "other": true,
        "prompt": "Does your work involve preventing the use of alcohol, tobacco, illicit or prescription drugs or reducing harms of alcohol, tobacco, illicit drugs or prescription drugs (including harm reduction programs)?",
        "helptext": "Check all that apply. If your work does not involve one of these areas, but you still think you should do this survey, please get in touch with us: elph@uvic.ca.",
        "arrayPrompts": [
            {"arrayid": 0, "prompt": "Alcohol", "value": "alcohol"},
            {"arrayid": 1, "prompt": "Tobacco", "value": "Tobacco"},
            {"arrayid": 2, "prompt": "Illicit drugs", "value": "Illicit drugs"},
            {"arrayid": 4, "prompt": "Prescription drugs", "value": "Prescription drugs"}

        ]
    }, function (x) {
        console.log(JSON.stringify(x, null, 2));
    });
}
