/**
 * Created by jfagan on 3/25/15.
 * oe/oe_server/api/controllers/pool-listings.js
 */

var fs = require('fs');
var _ = require('lodash');

// Get the list of the oe pools
function readPoolListings() {
    var path = appRoot + '/oe/oe_pools/';
    var poolListings = [];
    var pools = {};

    var dirs = fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });

    _.forEach(dirs, function (d) {
        var jsonFile = path + d + '/pool.json';
        // Has to by Sync otherwise I get empty returns some times.
        var jsonRead = fs.readFileSync(jsonFile, 'utf8');
        var jsonData = JSON.parse(jsonRead);
        pools[jsonData.poollogic.poolid] = jsonData;
    });

    _.forEach(pools, function (pool) {
        var poolListing = {
            title: pool.poollogic.title,
            poolid: pool.poollogic.poolid,
            description: pool.poollogic.description,
            numberOfSheets: pool.sheetlogic.length,
            numberOfEddis: pool.eddilogic.length,
            dateCreated: pool.poollogic.dateCreated
        };
        poolListings.push(poolListing);
    });

    return (poolListings);
}
module.exports.readPoolListings = readPoolListings;

function getPoolListings(req, res, next) {
    var poolListings = readPoolListings();
    res.json(poolListings);
}
module.exports.get = getPoolListings;
