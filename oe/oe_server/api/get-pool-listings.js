/**
 * Created by jfagan on 3/9/15.
 */
var fs = require('fs');
var _ = require('lodash');

// Get the list of the oe pools
var getPools = function () {
    var path = global.appRoot + '/oe/oe_pools';
    var dirs = fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });

    var pools = {};
    _.forEach(dirs, function (d) {
        var jsonFile = path + d + '/pool.json';
        // Has to by Sync otherwise I get empty returns some times.
        var jsonRead = fs.readFileSync(jsonFile, 'utf8');
        var jsonData = JSON.parse(jsonRead);
        pools[jsonData.pool._poolid] = jsonData;
    });

    return pools;
};

module.exports = getPools();

