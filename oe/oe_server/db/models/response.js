/**
 * Created by jfagan on 3/25/15.
 *
 */

var Sequelize = require('sequelize');
var sequelize = require('../config');

var Response = sequelize.define('Response', {
    id: Sequelize.STRING,     //unique identifier for every response
    puid: Sequelize.STRING,   // The unique identifier for the pool occassion
    poolid: Sequelize.STRING, // The id of the pool that was used
    eid: Sequelize.INTEGER,   // The eddi id from the pool
    logic: Sequelize.JSON,    // Logic of the eddi (for recreating the version of the suvey the person took)
    response: Sequelize.JSON  // The response data
}, {
    tableName: 'responses',
    timestamps: true,
    createdAt: 'datecreated',
    updatedAt: 'lastupdated'
});

exports.Response = Response;