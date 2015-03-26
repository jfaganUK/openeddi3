/**
 * Created by jfagan on 3/8/15.
 */

var browserify = require('browserify');
var fs = require('fs');
var b = browserify('./oe/oe.js');
b.transform('jstify',
    {engine: 'lodash', templateOpts: {variable: 'rc'}})
b.bundle().pipe(fs.createWriteStream('built.js'));

