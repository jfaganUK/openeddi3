/**
 * Created by jfagan on 6/13/15.
 * oe/oe_server/api/controllers/controller-response-tables.js:3
 *
 * @description Will return the response tables that can be accessed for a certain poolid.
 */

var Pool = require('../../db/models/_list').Pool;
var Response = require('../../db/models/_list').Response;
var log = require('util').log;
var async = require('async');
var _ = require('lodash');

/*
 * GET /api/admin/responsetables/:poolid
 *
 * Returns list of tables and meta-data about the table
 * [{
 *   poolid: poolid,
 *   tableName: this is the data name of the table,
 *   tableTitle: the display name of the table,
 *   description: description of the table,
 *   numberOfRows: number of rows that will be output,
 *   firstResponse: date of the first response,
 *   lastResponse: date of the last response,
 *   apiurl: the address of the api for accessing responses?
 * }]
 */

function baseResponseInfo(poolid, callback) {
    var baseResInfo = {
        poolid: poolid,
        tableName: "poolResponses",
        tableTitle: "Pool Responses",
        description: "Base responses data for the pool."
    };
    Pool.findAll({where: {poolid: poolid}})
        .then(function (pools) {
            var dates = _.pluck(pools, 'dateupdated');
            baseResInfo.numberOfRows = pools.length;
            baseResInfo.firstResponse = _.min(dates);
            baseResInfo.lastResponse = _.max(dates);
            callback(baseResInfo);
        })
        .catch(function (err) {
            log('[ERROR] [baseResponseInfo] Attempting to find pools');
            console.log(err);
            callback(baseResInfo);
        });
}

function getSummaryTableModules() {
    var summaryTableModules = [], m;
    for (var k in oeModules) {
        if (oeModules.hasOwnProperty(k)) {
            m = oeModules[k];
            if (m.hasOwnProperty('api')) {
                if (m.api.hasOwnProperty('summaryresponse')) {
                    summaryTableModules.push(appRoot + '/oe' + m.urlPath + '/' + m.api.summaryresponse.file);
                }

            }

        }
    }
    return (summaryTableModules);
}

function getResponseTables(req, res, next) {
    var poolid = req.params.poolid;
    var responseTables = [],
        fq = []; //The function queue

    // Using async to build the data, so start a function queue.
    // The 'responses' table is available for every table is a default built-in
    fq.push(function (cb) {
        baseResponseInfo(poolid, function (rt) {
            responseTables = responseTables.concat(rt);
            cb();
        })
    });

    /* Push the functions from the different modules onto the async queue */
    // get an array of all the summaryTable functions from the different modules
    var summaryTableModules = getSummaryTableModules();
    // for each of the summaryTable function, push a wrapped version into the function queue
    // each function that runs pushes a new object on to responseTables
    _.each(summaryTableModules, function (fileLoc) {
        fq.push(function (callback) {
            require(fileLoc)(poolid, function (rt) {
                responseTables = responseTables.concat(rt);
                callback();
            })
        });
    });

    // run the function queue
    // when it's done, send the response
    async.series(fq, function (err) {
        res.status(200).json(responseTables);
    });

}
module.exports.getTables = getResponseTables;
