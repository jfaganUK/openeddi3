/**
 * Created by jfagan on 3/8/15.
 * This file builds the application.
 * openeddi-build.js
 */

var browserify = require('browserify');
var fs = require('fs');

require('./include-oe-modules')();

// Browserify the primary app file, every branches from here
var b = browserify('./oe/oe.js');

// jstify will allow browserify to use external template files
b.transform('jstify',
    {engine: 'lodash', templateOpts: {variable: 'rc'}});
b.bundle().pipe(fs.createWriteStream('built.js'));

