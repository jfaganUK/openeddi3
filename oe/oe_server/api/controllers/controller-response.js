/**
 * Created by jfagan on 3/25/15.
 * oe/oe_server/api/controllers/response.js
 */

var Response = require('../../db/models/_list').Response;

/*
 * Get one response by id
 * GET /responses/rid/:rid/:id
 */

function getResponse(req, res, next) {
    console.log('-- Get one response');
    Response.find({where: {id: req.param.id, puid: req.params.puid}})
        .complete(function(err, response) {
            if (!!err) {
                res.status(400).send("Unable to find response.");
            } else {
                res.status(200).send(response);
            }
        });

    next();
}
exports.get = getResponse;

/*
 * Get all the responses
 */
function getAllResponses(req, res, next) {
    console.log('-- Get all responses for puid');
    res.json({message: "you asked for poolid: " + req.params.poolid + " and puid: " + req.params.puid});
    Response.find({where: {puid: req.params.puid}})
        .then(function(responses) {
            if(!responses) {
                //res.json({message: "didn't find any responses for you!"})
            }
            //res.json(responses);
        });
    next();
}
exports.getall = getAllResponses;

// POST Response
function postResponse(req, res, next) {
    console.log('**** Response POST request');
    console.log(req.params);

    Response.create({
        id: req.params.id,
        puid: req.params.puid,
        poolid: req.body.poolid,
        eid: req.body.eid,
        logic: req.body.logic,
        response: req.body.response
    }).complete(function(err, response) {
        if(!!err) {
            console.log("Failed to save response: ", err);
            res.status(400).send("Failed to save response.");
        } else {
            res.status(201).send(response.dataValues);
        }
    });


    next();
}
exports.post = postResponse;

// PUT Response
function putResponse(req, res, next) {
    console.log('**** Response PUT request');
    var params = req.params;
    var body = req.body;

    // Just because it's a put request doesn't mean the entry actually exists
    // The client-side creates the id, so Backbone treats it as a pre-existing item
    Response.find({where: {id: params.id, puid: params.puid }})
        .complete(function(err, x) {
            if(!!err) {
                var returnMessage = 'A system error occurred: ' + err.message;
                console.log(returnMessage);
                res.status(500).send(returnMessage);
            } else if (!x) {
                 //postResponse(req, res, next);
                    Response.create({
                        id: params.id,
                        puid: params.puid,
                        poolid: body._poolid,
                        eid: body._eid,
                        logic: body.logic,
                        response: body.response
                    }).complete(function(err, x) {
                        if(!!err) {
                            console.log("Failed to save response: ", err);
                            res.status(400).send("Failed to save response.");
                        } else {
                            res.status(201).send(x.dataValues);
                        }
                    });
            } else {
                // There is an existing response with that ID
                // So update it
                x.id = params.id;
                x.puid = params.puid;
                x.poolid = body._poolid;
                x.eid= body._eid;
                x.logic = body.logic;
                x.response = body.response;

                x.save()
                    .complete(function(err, x) {
                        if(!!err) {
                            res.status(400).send("Error saving the response.");
                        } else {
                            res.json(x);
                        }
                    });
            }
        });

    next();
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

    next();
}
exports.delete = deleteResponse;