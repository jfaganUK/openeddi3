/**
 * Created by jfagan on 3/28/15.
 * oe/oe_server/api/controllers/controller-pools.js
 */

var Pool = require('../../db/models/_list').Pool;
var log = require('util').log;

/*
 * GET The single pool
 */

function getPool(req, res, next) {
    log('--- Get pool ' + req.params.poolid + '/' + req.params.puid);

    Pool.find({where: {puid: req.params.puid}})
        .complete(function(err, pool) {
            if(!!err) {
                res.status(400).send('Unable to find the pool.');
            } else if (!pool) {
                // Can't find them pool in the database, so send a blank new pool
                var newPool = require('../get-pool')(req.params.poolid);
                log('API: GET /pool/' + req.params.poolid);
                res.status(200).json(newPool);
            } else {
                // The pool was found in the database, send the pool
                res.status(200).json(pool.dataValues);
            }
        })
}
exports.get = getPool;

/*
 * POST a pool
 */
function postPool(req, res, next) {
    Pool.create({
        puid: req.params.puid,
        poolid: req.params.poolid,
        poollogic: req.body.poollogic,
        poolstatus: req.body.poolstatus,
        sheetlogic: req.body.sheetlogic,
        sheetid: req.body.sheetid,
        username: req.body.username,
        meta: req.body.meta
    }).complete(function(err, pool) {
        if(!!err) {
            log('Failed to save the pool: ', err);
            res.status(400).send('Failed to save the pool.');
        } else {
            res.status(201).json(pool.dataValues);
        }
    });
}
exports.post = postPool;

/*
 * The PUT request both updates the records and creates new ones. The client creates guid's since it can't rely on
 * having a server always available. So when Backbone finds that an id already exists, it assumes that
 */

function putPool(req, res, next) {
    log('**** PUT Pool');

    Pool.find({where: {puid: req.params.puid}})
        .complete(function (err, pool) {
            if (!!err) {
                log('A system error occurred: ' + err.message);
                res.status(500).send('A system error occurred: ' + err.message);
            } else if (!pool) {
                // Then there is no record in the database so, make a new one
                postPool(req, res, next);
            } else {
                // The pool exists, so update it
                pool.poostatus = req.body.poolstatus;
                pool.sheetid = req.body.sheetid;
                pool.meta = req.body.meta;

                pool.save()
                    .complete(function (err, pool) {
                        if (!!err) {
                            res.status(400).send('Erro saving the pool.');
                        } else {
                            res.status(201).json(pool.dataValues);
                        }
                    })

            }
        });
}
exports.put = putPool;

/*
 * DELETE a respondent pool - but I'm not sure why this would ever be necessary. But we can still code for it.
 */

function deletePool(req, res, next) {
    Pool.find({where: {puid: req.params.puid}})
        .complete(function (err, pool) {
            if (!!err) {
                res.status(400).send('Error finding the pool for deletion');
            } else {
                pool.destroy()
                    .complete(function (err, pool) {
                        if (!!err) {
                            res.status(400).send('Error deleting the pool');
                        } else {
                            res.status(200).send(pool);
                        }
                    });
            }
        });
}
exports.delete = deletePool;

