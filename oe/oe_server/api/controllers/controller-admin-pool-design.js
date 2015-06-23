/**
 * Created by jfagan on 6/22/15.
 * oe/oe_server/api/controllers/controller-admin-pool-design.js:3
 */

var PoolDesign = require('../../db/models/_list').PoolDesign;
var log = require('util').log;
var fs = require('fs');
var async = require('async');
var sequelize = require('../../db/config');

/*
 * GET /api/admin/pooldesign/:poolid
 * Will get the most recent pool from the design table
 */

function getTopPoolDesign(req, res, next) {
    log('[getTopPoolDesign] GET PoolDesign: ' + req.params.poolid);

    PoolDesign.find({
        where: {poolid: req.params.poolid},
        order: [[sequelize.col('dateinserted'), 'DESC']]
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
    var poollogic = req.body.poollogic;
    var poolid = req.params.poolid;
    var push = req.query.push;
    log('[putPoolDesign] ' + poolid);

    PoolDesign.create({
        poolid: poolid,
        poollogic: poollogic,
        username: req.body.username,
        meta: req.body.meta
    })
        .then(function (pd) {
            poolDirectoryPrep(pd, function () {
                // if the survey directory already exists it won't push
                // unles push is truthy
                if (push) {
                    pushJSON(pd, function () {
                        res.status(201).json(pd);
                    })
                } else {
                    res.status(201).json(pd);
                }
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
 * @param pd a row from the pooldesign table
 * @param callback callback when the operation is complete
 */
function poolDirectoryPrep(pd, callback) {
    var poolid = pd.poolid;
    var poollogic = pd.poollogic;
    var dir = appRoot + '/oe/oe_pools/' + poolid;

    makeDir(dir, function (d) {
        // if returns false then the directory did not exist
        // and it was created, so we need to push the JSON
        if (d === false) {
            // create the JSON file
            pushJSON(pd, function (err) {
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

function pushJSON(pd, callback) {
    var dir = appRoot + '/oe/oe_pools/' + pd.poolid;
    var filename = dir + '/pool.json';
    var poollogic = pd.poollogic;
    poollogic.poollogic.dateCreated = pd.dateinserted;
    poollogic.poollogic.username = pd.username;
    poollogic.poollogic.meta = pd.meta;
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
