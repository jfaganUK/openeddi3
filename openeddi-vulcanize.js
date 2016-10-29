/**
 * Created by jfagan on 10/24/16.
 * openeddi-vulcanize.js
 *
 * Vulcanize the app so that all the HTML imports are embedded in a single file. This should dramatically improve loading
 * time, especially for poly-filled browsers (Firefox, IE, etc.)
 *
 */

var Vulcanize = require('vulcanize');
var ejs = require('ejs');
var path = require('path');
global.appRoot = path.resolve(__dirname);

var _ = require('lodash');                // For some functional programming
var fs = require('fs');                   // For using the file system.
var log = require('util').log;            // For better logging (with timestamps)
var inspect = require('util').inspect;
var async = require('async');
var bcrypt = require('bcryptjs');


// Load the Eddi modules
global.oeModules = null;
var loadEddiModules = function (callback) {
    log('[startup] Loading eddi modules');

    require('./oe/oe_server/load-oe-module-information')(function (d) {
        oeModules = d;
        callback(null);
    });
};

loadEddiModules(function () {
    //console.log(JSON.stringify(oeModules, null, 2));
    ejs.renderFile('./oe/index.ejs', {
        csrfToken: '',
        oe: {test: 'the test'},
        oeModules: oeModules
    }, null, function (err, str) {
        if (err) {
            return console.log(err);
        } else {
            console.log('--- Rendered ejs');
            fs.writeFile("./oe/compiled-app.html", str, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log('--- Wrote html to file');

                var vulcan = new Vulcanize({
                    abspath: '/home/jfagan/Dropbox/projects/openeddi/openeddi3/oe/',
                    excludes: [],
                    stripExcludes: [],
                    inlineScripts: false,
                    inlineCss: false,
                    addedImports: [],
                    redirects: [],
                    implicitStrip: true,
                    stripComments: false,
                    inputUrl: ''
                });

                vulcan.process('./compiled-app.html', function (err, inlinedHtml) {
                    if (err) {
                        return console.log(err);
                    }

                    fs.writeFile("./oe/vulcanized-app.html", inlinedHtml, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log('--- Vulcanized to file');
                    });
                });
            });
        }

    });
});





