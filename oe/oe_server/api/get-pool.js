/**
 * Created by jfagan on 3/17/15.
 */

var fs = require('fs');

module.exports = function (poolid) {
    var path = appRoot + '/oe/oe_pools/';
    var jsonFile = path + poolid + '/pool.json';
    var jsonRead = fs.readFileSync(jsonFile, 'utf8');
    return JSON.parse(jsonRead);
};

