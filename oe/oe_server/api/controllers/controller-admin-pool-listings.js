/**
 * Created by jfagan on 6/4/15.
 * oe/oe_server/api/controllers/controller-admin-pool-listings.js
 */

var Pool = require('../../db/models/_list').Pool;
var log = require('util').log;

/*
 * GET list of all pools
 */

function getPools(req, res, next) {
    Pool.findAll()
        .then(function (pools) {
            log('Got the pools!');
            res.status(200).json(pools);
        });
}
module.exports.getAll = getPools;



