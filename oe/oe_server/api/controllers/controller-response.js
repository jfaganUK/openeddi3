/**
 * Created by jfagan on 3/25/15.
 * oe/oe_server/api/controllers/response.js
 */

var Response = require('../../db/models/_list').Response;
var log = require('util').log;

/*
 * Get one response by id
 * GET /responses/:rid/:id
 */

function getResponse(req, res, next) {
    console.log('-- Get one response');
    Response.find({where: {id: req.params.id, puid: req.params.puid}})
        .complete(function(err, response) {
            if (!!err) {
                res.status(400).send("Unable to find response.");
            } else {
                res.status(200).json(response.dataValues);
            }
        });
}
exports.get = getResponse;

/*
 * Get all the responses
 */
function getAllResponses(req, res, next) {
    Response.findAll({where: {puid: req.params.puid}})
        .complete(function(err, responses) {
            if(!!err) {
                console.log('Error retrieving the responses');
                res.status(400).send('Unable to retrieve the responses');
            } else if (!responses) {
                res.status(400).send("didn't find any responses for you!");
            } else {
                res.status(200).json(responses);
            }
        });
}
exports.getall = getAllResponses;

// POST Response
function postResponse(req, res, next) {
    Response.create({
        puid: req.params.puid,
        poolid: req.body.poolid,
        eid: req.body.eid,
        sheetid: req.body.sheetid,
        logic: req.body.logic,
        response: req.body.response
    }).complete(function(err, response) {
        if(!!err) {
            console.log("Failed to save response: ", err);
            res.status(400).send("Failed to save response.");
        } else {
            res.status(201).json(response.dataValues);
        }
    });
}
exports.post = postResponse;

// PUT Response
function putResponse(req, res, next) {
    console.log('**** Response PUT request');
    var params = req.params;
    var body = req.body;

    // Just because it's a put request doesn't mean the entry actually exists
    // The client-side creates the id, so Backbone treats it as a pre-existing item
    // Search by eid and puid, this should be a unique pairing within the database
    Response.find({where: {eid: params.eid, puid: params.puid }})
        .complete(function(err, response) {
            if(!!err) {
                var returnMessage = 'A system error occurred: ' + err.message;
                console.log(returnMessage);
                res.status(500).send(returnMessage);
            } else if (!response) {
                // There is no record in the database, so make a new one.
                postResponse(req, res, next);
            } else {
                // There is an existing response with that eid, so update with current data
                // The only thing that really should be updated is the 'response' data.
                response.response = body.response;

                response.save()
                    .complete(function(err, response) {
                        if(!!err) {
                            res.status(400).send("Error saving the response.");
                        } else {
                            res.status(200).json(response.dataValues);
                        }
                    });
            }
        });

    // For some reason putting next here triggers an error. It creates another
    // Can't set headers after they are sent, error.
    // next();
}
exports.put = putResponse;

// DELETE Response
function deleteResponse(req, res, next) {
    Response.find(req.params.id)
        .complete(function(err, response) {
            if(!!err) {
                res.status(400).send("Error finding the response for deletion.");
            } else {
                response.destroy()
                    .complete(function(err, response){
                        if(!!err) {
                            res.status(400).send("Error deleting the response");
                        } else {
                            res.status(200).send(response);
                        }
                    });
            }
        });
}
exports.delete = deleteResponse;