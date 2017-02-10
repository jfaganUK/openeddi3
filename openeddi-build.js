/**
 * Created by jfagan on 3/8/15.
 * This file builds the application.
 * openeddi-build.js
 */


var fs = require('fs');
var Vulcanize = require('vulcanize');
var log = require('util').log;

/**
 * Create the Browserify bundle
 * @param callback
 */
var browserifyOpenEddi = function (callback) {
    var browserify = require('browserify');
    // Every key js file on the client branches from oe.js
    var b = browserify('./oe/oe.js');

    // jstify will allow browserify to use external template files
    log('[openeddi-build] Compiling templates into the bundle');
    b.transform('jstify', {engine: 'lodash', templateOpts: {variable: 'rc'}});
    // export the file here
    var builtFile = fs.createWriteStream('./oe/built.js');

    // and bundle and export
    log('[openeddi-build] Bundling all javascript files into build.js');
    b.bundle().pipe(builtFile);


    var cleanup = function () {
        builtFile.removeListener('finish', finish);
        builtFile.removeListener('error', error);
    };
    var finish = function () {
        cleanup();
        callback(null);
    };
    var error = function (err) {
        cleanup();
        callback(err);
    };

    builtFile.addListener('finish', finish);
    builtFile.addListener('error', error);
};


/**
 * Render the index.ejs file, if we are using vulcanize
 * @param callback
 */
var renderOEEJS = function (callback) {
    var ejs = require('ejs');

    // function to write the file
    var writeRenderedEJS = function (err, str) {
        if (err) {
            return console.log(err);
        } else {
          var options = { flag : 'w' };
            // fs.writeFile("./oe/compiled-app.html", str, function (err) {
            fs.writeFile("./oe/oe_client/compiled-app.html", str, options, function (err) {
                if (err) {
                    callback(err);
                } else {
                    log('compiled-app.html complete');
                    // callback();
                    callback(null);
                }
            });
        }
    };

    // render the file
    log('[openeddi-build] Rendering EJS');
    ejs.renderFile(appRoot + '/oe/index.ejs', {
        csrfToken: '',
        OEConfig: OEConfig,
        oe: {test: 'the test'},
        oeModules: oeModules
    }, null, writeRenderedEJS);
};


/**
 * Vulcanize the html. This process takes all the html imports, along with all the CSS and JS, and inserts them into a single html file.
 * @param callback
 * @returns {void|*}
 */
var vulcanizeOpenEddi = function (callback) {
    
    var vulcanExcludes = ["/bower_components/iron-flex-layout/iron-flex-layout-classes.html",
        "/bower_components/iron-flex-layout/iron-flex-layout.html"];
    // Excluding these things lets chrome work, but then firefox doesn't work
    // if they are not excluded firefox works, but the classes don't register for Chrome
    var vulcan = new Vulcanize({
        abspath: appRoot + '/oe/',
        excludes: [],
        stripExcludes: [],
        inlineScripts: true,
        inlineCss: true,
        addedImports: [],
        redirects: [],
        implicitStrip: true,
        stripComments: false,
        inputUrl: ''
    });

    log('[openeddi-build] Vulcanizing application');
    // vulcan.process('./compiled-app.html', function (err, inlinedHtml) {
    vulcan.process('./oe_client/compiled-app.html', function (err, inlinedHtml) {
    
        if (err) {
            log('vulcan error error ');
            log(err);
            callback(err);
        }

        // fs.writeFile("./oe/vulcanized-app.html", inlinedHtml, function (err) {
        var options = { flag : 'w' };
        fs.writeFile("./oe/oe_client/vulcanized-app.html", inlinedHtml, options, function (err) {
            if (err) {
                log('vlucan file error');
                return log(err);
            }
            log('[openeddi-build] Vulcanized to file');
            callback(null);
            // callback();
        });
    });
};

/**
 * Uglify the bundled javascript. Minify it so that it's a smaller file size (and in some cases, runs faster)
 * @param callback
 */
var uglifyBuiltJS = function (callback) {
    log('[openeddi-build] Minifying built.js');
    var uglify = require('uglify-js');
    var minBuilt = uglify.minify(appRoot + '/oe/built.js');
    fs.writeFile("./oe/built-min.js", minBuilt.code, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};


/**
 * The access point for this file.
 * @param callback
 */
var buildAppFile = function (callback) {
    var async = require('async');
    var appBuildQueue = [browserifyOpenEddi];

    if (OEConfig.build.minify) {
        appBuildQueue.push(uglifyBuiltJS);
    }

    if (OEConfig.build.vulcanize) {
        appBuildQueue.push(renderOEEJS);
        appBuildQueue.push(vulcanizeOpenEddi);
    }

    async.series(appBuildQueue, function (err) {
        
        log(' async func... do we ever get here?');
        if (err) {
            log('[openeddi-build] Error building the application file');
            log(err);
            callback(err);
        } else {
            log('[openeddi-build] Finished building app file');
            callback();
        }
    });
};

module.exports = buildAppFile;

