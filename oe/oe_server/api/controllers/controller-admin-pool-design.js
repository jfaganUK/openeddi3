/**
 * Created by jfagan on 6/22/15.
 * oe/oe_server/api/controllers/controller-admin-pool-design.js:3
 */

var PoolDesign = require('../../db/models/_list').PoolDesign;
var log = require('util').log;
var fs = require('fs');
var async = require('async');

/*
 * GET /api/admin/pooldesign/:poolid
 * Will get the most recent pool from the design table
 */

function getTopPoolDesign(req, res, next) {
    log('[getTopPoolDesign] GET PoolDesign: ' + req.params.poolid);

    PoolDesign.find({
        where: {poolid: req.params.poolid},
        order: [sequelize.fn('max', sequelize.col('dateinserted')), 'DESC']
    })
        .then(function (pd) {
            res.status(200).json(pd);
        })
        .catch(function (err) {
            console.error('[getTopPoolDesign] Error');
            log(err);
        });
}
module.exports.getTopPoolDesign = getTopPoolDesign;

/*
 * PUT /api/admin/pooldesign/:poolid
 * I don't expect a POST method since the poolid is created on the client.
 * So everything should come in as a PUT.
 * But the pooldesign methods here will not update an existing row, it will always insert a new one.
 *
 */

function putPoolDesign(req, res, next) {
    log('[putPoolDesign] ' + req.params.poolid);

    PoolDesign.create({
        poolid: req.params.poolid,
        poollogic: req.body.poollogic,
        username: req.body.username,
        meta: req.body.meta
    })
        .then(function (pd) {
            poolDirectoryPrep(req.params.poolid, req.body.poollogic, function () {
                res.status(201).json(pd);
            });
        })
        .catch(function (err) {
            console.error('[putPoolDesign] Error');
            log(err);
        });
}
module.exports.putPoolDesign = putPoolDesign;

/**
 * Tests if a directory exists for this pool. If not it creates one and pushes out the first file.
 * @param poolid the id of the pool
 * @param poollogic the structure of the pool in a single object
 * @param callback callback when the operation is complete
 */
function poolDirectoryPrep(poolid, poollogic, callback) {
    var dir = appRoot + '/oe/oe_pools/' + poolid;

    makeDir(dir, function (d) {
        // if returns false then the directory did not exist
        // and it was created, so we need to push the JSON
        if (d === false) {
            // create the JSON file
            pushJSON(dir, poollogic, function (err) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null)
                }
            })
        } else {
            callback(d);
        }
    });

}
module.exports.poolDirectoryPrep = poolDirectoryPrep;

function pushJSON(dir, poollogic, callback) {
    var filename = dir + '/pool.json';
    var poolStr = JSON.stringify(poollogic, null, 4);

    // Poollogic should already be a pretty printed string
    fs.writeFile(filename, poolStr, function (err) {
        if (err) {
            log('[pushJSON] Error');
            console.error(err);
        } else {
            callback(null);
        }
    });

}

function makeDir(dir, callback) {
    fs.mkdir(dir, function (err) {
        if (err) {
            if (err.code == 'EEXIST') {
                callback(true);
            } else {
                callback(err);
            }
        } else {
            callback(false)
        }
    });
}
