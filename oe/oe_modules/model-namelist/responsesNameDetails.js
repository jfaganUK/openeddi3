/**
 * Created by jfagan on 6/19/15.
 * oe/oe_modules/model-namelist/responsesNameDetails.js:3
 */

var Namelist = require('../../oe_server/db/models/_list').Namelist;
var getPool = require('../../oe_server/api/get-pool');
var async = require('async');
var _ = require('lodash');

function responsesNameDetails(poolid, callback) {
    var pool = getPool(poolid); // get the pool definitions
    var names; // store the raw results from the database
    var fq = []; // not all the processes are async, but many of them are
    var tempResults = [], responseResults = {};

    // First get the raw names
    fq.push(function getAllNames(cb) {
        Namelist.findAll({where: {poolid: poolid}})
            .then(function (namelist) {
                names = namelist;
                cb();
            })
            .catch(function (err) {
                console.error(err);
                cb(err);
            });
    });

    // add on the header information
    // nameid, puid, name, lastupdated
    fq.push(function addNameHeaderInfo(cb) {
        _.each(names, function (name) {
            var nameRow = {
                puid: name.puid,
                poolid: name.poolid,
                lastupdated: name.lastupdated,
                nameid: name.id,
                name: name.name
            };
            tempResults.push(nameRow);
        });
        cb();
    });

    // add columns for the lists
    fq.push(function addNamelistColmns(cb) {
        var namelists = [], newResults = [];
        // first get a unique list of all namelists
        _.each(names, function (name) {
            namelists = _.union(namelists, name.lists);
        });

        // now add a column for each
        _.each(names, function (name) {
            var nameRow = _.findWhere(tempResults, {"nameid": name.id});
            _.each(namelists, function (nl) {
                var k = 'namelist__' + nl;
                nameRow[k] = _.contains(name.lists, nl);
            });
            newResults.push(nameRow);
        });
        tempResults = newResults;
        cb();
    });

    // put in the name details
    fq.push(function buildTempResults(cb) {
        var newResults = [], details = [];

        // not every name has the same details
        // this could be due to non-responses
        // in that case we need to add the default values, so to start, lets
        // get a list of the keys of all the stored details
        _.each(names, function (name) {
            details = _.union(details, _.keys(name.details));
        });
        _.pull(details, 'ties'); // ties is a whole other thing

        _.each(names, function (name) {
            var nameRow = _.findWhere(tempResults, {"nameid": name.id});
            _.each(details, function (d) {
                var eddi = _.findWhere(pool.eddilogic, {"eid": d});
                var responseFunc = getNameDetailResponseFunc(eddi);
                if (responseFunc) {
                    nameRow = _.merge(nameRow, responseFunc(eddi, name.details[d]));
                }
            });
            newResults.push(nameRow);
        });
        tempResults = newResults;
        cb();
    });

    // rebuild the results in a way that the data table and other stuff expect it
    // which is an object of arrays
    fq.push(function rebuildResults(cb) {
        var columns = _.keys(tempResults[0]); // column names, the keys of the first object
        _.each(columns, function (c) {
            responseResults[c] = _.pluck(tempResults, c);
        });
        cb()
    });


    async.series(fq, function () {
        // Everything should be ready, send the results to the awaiting function
        callback(responseResults);
    });

}
module.exports = responsesNameDetails;

function getNameDetailResponseFunc(eddi) {
    var eddiModule = eddi.controlmodule;
    var responseVectorFunc, fileLoc;
    if (oeModules.hasOwnProperty(eddiModule)) {
        if (oeModules[eddiModule].hasOwnProperty('output')) {
            if (oeModules[eddiModule].output.hasOwnProperty('namedetail')) {
                fileLoc = appRoot + '/oe' + oeModules[eddiModule].urlPath + '/' + oeModules[eddiModule].output.namedetail.file;
                responseVectorFunc = require(fileLoc);
            }
        }
    }
    return (responseVectorFunc);
}