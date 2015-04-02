/**
 * Created by jfagan on 3/25/15.
 * oe/oe_server/db/models/response.js
 */

var Sequelize = require('sequelize');
var sequelize = require('../config');
var guid = require('../../helpers/guid');

var Response = sequelize.define('Response', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: guid
    },      //unique identifier for every response
    puid: Sequelize.STRING,    // The unique identifier for the pool occasion
    poolid: Sequelize.STRING,  // The id of the pool that was used
    eid: Sequelize.STRING,     // The eddi id from the pool (note, the api references the puid and eid to uniquely query the response)
    sheetid: Sequelize.STRING, // The sheet id from the pool
    logic: Sequelize.JSON,     // Logic of the eddi (for recreating the version of the survey the person took)
    response: Sequelize.JSON   // The response data
}, {
    tableName: 'responses',
    timestamps: true,
    createdAt: 'datecreated',
    updatedAt: 'lastupdated'
});

exports.Response = Response;