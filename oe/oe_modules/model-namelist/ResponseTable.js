/**
 * Created by jfagan on 6/13/15.
 * oe/oe_modules/model-namelist/ResponseTable.js:3
 * @description Provide a response table for the node details and the ties. This is the aggregate, meta data for
 * the tables to be displayed in /admin/responses/:poolid.
 */


var Namelist = require('../../oe_server/db/models/_list').Namelist;
var _ = require('lodash');
var log = require('util').log;
var async = require('async');

var getNameTies = require('./getNamelistTies');

function getNameDetailResponseTable(poolid, callback) {
    var responseTableEntry = {
        poolid: poolid,
        tableName: "nameDetails",
        tableTitle: "Name Details",
        description: "Attributes of the names / nodes."
    };

    Namelist.findAll({where: {poolid: poolid}})
        .then(function (names) {
            var dates = _.pluck(names, 'lastupdated');
            responseTableEntry.numberOfRows = names.length;
            responseTableEntry.firstResponse = _.min(dates);
            responseTableEntry.lastResponse = _.max(dates);
            callback(responseTableEntry);
        })
        .catch(function (err) {
            log('[ERROR] [getNameDetailResponseTable]' + err);
            console.log(err);
        });
}

function getNameTiesResponseTable(poolid, callback) {
    var entry = {
        poolid: poolid,
        tableName: "nameTies",
        tableTitle: "Name Ties",
        description: "Ties between the names / nodes."
    };


    // need to get dates of responses here, the tieTable doesn't contain it.
    getNameTies(poolid, function (tieTable) {
        var dates = _.pluck(tieTable, 'lastupdated');
        entry.numberOfRows = tieTable.length;
        entry.firstResponse = _.min(dates);
        entry.lastResponse = _.max(dates);
        callback(entry);
    });
}

function namelistSummaryResponseTable(poolid, callback) {
    var responseTables = [];

    async.series({
        1: function (cb) {
            getNameDetailResponseTable(poolid, function (b) {
                responseTables.push(b);
                cb();
            });
        },
        2: function (cb) {
            getNameTiesResponseTable(poolid, function (b) {
                responseTables.push(b);
                cb();
            })
        }
    }, function (err) {
        callback(responseTables);
    });
}
module.exports = namelistSummaryResponseTable;
