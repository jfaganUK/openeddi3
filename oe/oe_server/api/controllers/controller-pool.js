/**
 * Created by jfagan on 6/6/15.
 * oe/oe_server/api/controllers/controller-pool.js
 *
 * This is the API for getting the pool data.
 * When the user creates a pool and deploys it, the pool and all related assets will be put into
 * a oe/oe_pools/<poolname> folder. I want to keep an "undo" log of the pool though.
 *
 *
 */

var Pool = require('../../db/models/_list').Pool;
var log = require('util').log;

/*
 * Get a single pool
 * GET /pool/:puid
 * Note: GET /pool/:poolid/:puid will get the pool logic file and assets.
 * This gets an already created pool from the database.
 */

function getPool(req, res, next) {
    var msg;
    log('[API] [getPool] Getting pool ' + req.params.puid);

    Pool.find({where: {puid: req.params.puid}})
        .then(function (pool) {
            if (!pool) {
                msg = '[API] [getPool] Could not retrieve ' + req.params.puid;
                log(msg);
                res.status(400).json({message: msg});
            } else {
                res.status(200).json(pool);
            }
        });
}
module.exports.get = getPool;

/*
 * Create a new pool entry.
 * POST /pool/:puid
 */

function postPool(req, res, next) {
    log('[API] [postPool] Creating a new pool ' + req.params.puid);
    var ip = req.ip;
    var poolstatus = {status: "initial insert"};
    var poollogic = {};
    Pool.create({
        puid: req.params.puid,
        ipaddress: ip,
        poolid: req.body.poolid,
        poolstatus: poolstatus,
        poollogic: poollogic,
        sheetindex: 0,
        username: '',
        meta: {}
    });
}