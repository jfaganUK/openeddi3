/**
 * Created by jfagan on 6/4/15.
 * oe/oe_server/api/controllers/controller-admin-pool-listings.js
 */

var Pool = require('../../db/models/_list').Pool;
var readPoolListings = require('./pool-listings').readPoolListings;
var log = require('util').log;
var _ = require('lodash');
var async = require('async');


/*
 * GET list of all pools
 */
function getPoolListings(req, res, next) {
    var poolListings = readPoolListings();
    var returnPools = [];

    async.forEachOf(poolListings, function (poolListing, key, callback) {
        Pool.findAll({where: {poolid: poolListing.poolid}})
            .then(function (pools) {
                poolListing.numResponses = pools.length;
                returnPools.push(poolListing);
                callback();
            });
    }, function (err) {
        if (err) {
            log('[Admin-getPoolListings] Error: ' + err);
        }
        res.status(200).json(returnPools);
    });

}

module.exports.getAll = getPoolListings;



