/**
 * Created by jfagan on 6/21/15.
 * oe/oe_modules/model-namelist/responsesNameTies.js
 */

var getNamelistTies = require('./getNamelistTies');
var async = require('async');
var _ = require('lodash');

function responsesNameTies(poolid, callback) {
    var namelistTies = {}, returnTies = {};
    var fq = [];

    // get the ties from the database
    fq.push(function getTempNamelistTies(cb) {
        getNamelistTies(poolid, function (nt) {
            namelistTies = nt;
            cb();
        });
    });

    // then gussy it up so that the CSV and display tables can use it
    fq.push(function rebuildResults(cb) {
        var columns = _.keys(namelistTies[0]); // column names, the keys of the first object
        _.each(columns, function (c) {
            returnTies[c] = _.pluck(namelistTies, c);
        });
        cb()
    });

    async.series(fq, function (err) {
        callback(returnTies);
    });

}
module.exports = responsesNameTies;