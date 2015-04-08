/**
 * Created by jfagan on 4/7/15.
 * This will load all the OpenEddi module information.
 * oe/oe_server/load-oe-module-information.js
 */

var fs = require('fs');
var _ = require('lodash');
var path = require('path');

module.exports = function() {
    var modPath = appRoot + '/oe/oe_modules/';
    var oeModules = {};

    // Get a list of only the directories in the /oe/oe_modules directory
    var dirs = fs.readdirSync(modPath).filter(function(file) {
        return fs.statSync(modPath + '/' + file).isDirectory();
    });

    // For each of these directories, get the oe-module.json out it, parse it, and push it on the array
    _.forEach(dirs, function (d) {
        var jsonFile = modPath + d + '/oe-module.json';
        var jsonRead = fs.readFileSync(jsonFile, 'utf8');
        var jsonData = JSON.parse(jsonRead);

        // Note the path of where the oe-module.json file was found
        jsonData.rootPath = path.relative(__dirname, modPath + d);
        jsonData.urlPath = '/oe_modules/' + d;
        oeModules[jsonData.name] = jsonData;
    });
    return oeModules;
};



