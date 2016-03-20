/**
 * Created by jfagan on 4/27/15.
 * oe/oe_modules/model-namelist/ApiNamelistController.js
 */

var Namelist = require('../../oe_server/db/models/_list').Namelist;
var log = require('util').log;

/*
 * GET /namelist/:puid/:id
 */

function getNamelist(req, res) {
    log('--- Get one name');
    Namelist.find({where: {id: req.params.id, puid: req.params.puid}})
        .complete(function (err, namelist) {
            if (!!err) {
                res.status(400).send('Unable to find namelist');
            } else {
                res.status(200).json(namelist.dataValues);
            }
        });
}
exports.get = getNamelist;

/*
 * Get all the namelists for a certain puid
 *
 * GET /namelist/:puid
 */

function getAllNamelists(req, res, next) {
    log(" -- Namelist: getAllNamelists ");
    Namelist.findAll({where: {puid: req.params.puid}})
        .complete(function (err, namelists) {
            if (!!err) {
                log('ERROR retrieving the namelists');
                res.status(400).send('Unable to retrieve the namelists');
            } else if (!namelists) {
                res.status(400).send('Did not find any namerlists for you.');
            } else {
                res.status(200).json(namelists);
            }
        });
}
exports.getall = getAllNamelists;

// POST /namelist/:puid/:id

function postNamelist(req, res, next) {
    Namelist.create({
        id: req.params.id,
        puid: req.params.puid,
        poolid: req.body.poolid,
        name: req.body.name,
        lists: req.body.lists,
        details: req.body.details
    }).complete(function (err, namelist) {
        if (!!err) {
            console.log(JSON.stringify(err, null, 4));
            log("Failed to save the namelist: ", err);
            res.status(400).send("Failed to save the namelist");
        } else {
            res.status(201).json(namelist.dataValues);
        }
    });
}
exports.post = postNamelist;

// PUT /namelist/:puid/:id
function putNamelist(req, res, next) {
    log("--- PUT /namelist/" + req.params.puid + "/" + req.params.id);
    var params = req.params;
    var body = req.body;

    Namelist.find({where: {puid: params.puid, id: params.id}})
        .complete(function (err, namelist) {
            if (!!err) {
                var returnMessage = "A system error occurred: " + err.message;
                log(returnMessage);
                res.status(500).send(returnMessage);
            } else if (!namelist) {
                // There was no record with that puid / id combination, so create a new one
                postNamelist(req, res, next);
            } else {
                namelist.name = body.name;
                namelist.lists = body.lists;
                namelist.details = body.details;

                namelist.save()
                    .complete(function (err, namelist) {
                        if (!!err) {
                            res.status(400).send("Error saving the namelist.");
                        } else {
                            res.status(200).json(namelist.dataValues);
                        }
                    });
            }

        });
}
exports.put = putNamelist;

// DELETE /namelist/:puid/:id
function deleteNamelist(req, res, next) {
    log('--- DELETE /namelist/' + req.params.puid + '/' + req.params.id);
    Namelist.find({where: {puid: req.params.puid, id: req.params.id}})
        .complete(function (err, namelist) {
            if (!!err) {
                res.status(400).send("Error finding the namelist for deletion.");
            } else {
                namelist.destroy()
                    .complete(function (err, namelist) {
                        if (!!err) {
                            res.status(400).send("Error deleting the namelist");
                        } else {
                            res.status(200).send(namelist);
                        }
                    });
            }

        });
}
exports.delete = deleteNamelist;
