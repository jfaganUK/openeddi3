/**
 * Created by jfagan on 3/25/15.
 * oe/oe_server/api/controllers/pool-listings.js
 */

var fs = require('fs');
var _ = require('lodash');

// Get the list of the oe pools
function getPoolListings(req, res, next) {
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
        pools[jsonData.pool.poolid] = jsonData;
    });

    _.forEach(pools, function (pool) {
        var poolListing = {
            title: pool.pool.title,
            poolid: pool.pool.poolid,
            description: pool.pool.description,
            numberOfSheets: pool.sheets.length,
            numberOfEddis: pool.eddis.length,
            dateCreated: pool.pool.dateCreated
        };
        poolListings.push(poolListing);
    });

    res.json(poolListings);
}

exports.get = getPoolListings;
