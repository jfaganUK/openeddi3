/**
 * Created by jfagan on 4/7/15.
 *
 * For each module we need to add these lines
 *
 * var OEModules = OEModules || {};
 * OEModules.modulename = require('path/to/module/client-index');
 *
 *
 * include-oe-modules.js
 */

var fs = require('fs');
global.appRoot = __dirname;

module.exports = function () {
    var oeModules;

    require('./oe/oe_server/load-oe-module-information')(function (d) {
        oeModules = d;
    });

    var o = "";

    o += "var OEModules = {};\n";

    var v = {};
    for (var k in oeModules) {
        v = oeModules[k];
        o += "OEModules." + k + " = require('." + v.urlPath + "/client-index');\n";
    }

    o += "module.exports = OEModules;\n";

    fs.writeFile('./oe/oe-modules.js', o, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('--- OE Modules compiled');
    });
};






