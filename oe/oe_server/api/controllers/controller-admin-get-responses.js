/**
 * Created by jfagan on 6/16/15.
 * oe/oe_server/api/controllers/controller-admin-get-responses.js
 */

/*

 GET /api/admin/responses/:table/:poolid
 User request all the response data for a specific table of a specific poolid.
 It returns an array with every row as an object. The idea being that it can be put into nice tabular
 table.
 [{"puid" : "the puid",
 "anEddiTitle" : 5,
 "anotherEddiTitle" : "Oh boy, this is a response"
 }]

 Each eddi should have a method for returning its response data as a vector, or set of vectors.
 For instance, a checklist will return a vector for each checkbox and with true / false values.
 If you have some other form of data, like a drawing or something, the main response table should return something
 like the size of the drawing, whether a drawing was actually done, something.

 */

var _ = require('lodash');
var getPool = require('../../api/get-pool');
var Pool = require('../../db/models/_list').Pool;
var Response = require('../../db/models/_list').Response;
var async = require('async');
var log = require('util').log;

// GET /api/admin/responses/:poolid/:table
function getAdminResponses(req, res, next) {
    var table = req.params.table;
    var poolid = req.params.poolid;

    if (table == 'responses') {
        getResponseTable(poolid, function (results) {
            res.status(200).json(results);
        });
    }
}
module.exports.getAdminResponses = getAdminResponses;

function getResponseTable(poolid, callback) {
    var pool = getPool(poolid); // Snag the pool logic (this is a sync function!)
    var results = {};
    var fq = [];
    // Go through each eddi and ask the eddi if it can provide a vector response
    _.forEach(pool.eddilogic, function (eddi) {
        var eddiModule = eddi.controlmodule;
        var fileLoc, responseVectorFunc;

        if (oeModules.hasOwnProperty(eddiModule)) {
            if (oeModules[eddiModule].hasOwnProperty('output')) {
                if (oeModules[eddiModule].output.hasOwnProperty('responses')) {
                    fileLoc = appRoot + '/oe' + oeModules[eddiModule].urlPath + '/' + oeModules[eddiModule].output.responses;
                    responseVectorFunc = require(fileLoc);
                }
            }
        }

        if (typeof responseVectorFunc === 'function') {
            fq.push(function (callback) {
                log('[getResponseTable] Getting table for ' + eddi.eid);
                responseVectorFunc(poolid, eddi, function (v) {
                    results = _.merge(results, v);
                    callback();
                });
            });
        }

    });

    console.log('Length of fq ' + fq.length);

    async.series(fq, function () {
        callback(results);
    })

}