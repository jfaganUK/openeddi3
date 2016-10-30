/**
 * Created by jfagan on 10/24/16.
 * openeddi-vulcanize.js
 *
 * Vulcanize the app so that all the HTML imports are embedded in a single file. This should dramatically improve loading
 * time, especially for poly-filled browsers (Firefox, IE, etc.)
 *
 */


var path = require('path');
global.appRoot = path.resolve(__dirname);

var _ = require('lodash');                // For some functional programming
var fs = require('fs');                   // For using the file system.
var log = require('util').log;            // For better logging (with timestamps)
var inspect = require('util').inspect;
var async = require('async');
var ejs = require('ejs');
var Vulcanize = require('vulcanize');


// Load the Eddi modules
global.oeModules = null;
var loadEddiModules = function (callback) {
    log('[startup] Loading eddi modules');

    require('./oe/oe_server/load-oe-module-information')(function (d) {
        oeModules = d;
        callback(null);
    });
};

loadEddiModules();





