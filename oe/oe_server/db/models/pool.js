/**
 * Created by jfagan on 3/25/15.
 * oe/oe_server/db/models/pool.js
 * Previously this was the "Respondent" model. But I want to be able to have multiple pools for a single respondent.
 * So this is now the 'pool' model. It represents a single occasion of data collection on a particular pool.
 */

var Sequelize = require('sequelize');
var sequelize = require('../config');

var Pool = sequelize.define('Pool', {
    puid: Sequelize.STRING,          // A guid
    ipaddress: Sequelize.STRING,     // The ipaddress they were tracked from
    poolid: Sequelize.STRING,        // What pool they took (note, may change this to a JSON field in case of multiple surveys)
    poolstatus: Sequelize.JSON,      // What is the current status of the survey they are taking?
    poollogic: Sequelize.JSON,       // The logic of the pool
    sheetlogic: Sequelize.JSON,      // The logic of the sheets (the logic of the eddis is kept in the response table
    sheetindex: Sequelize.INTEGER,   // The last page they were on of the survey (again, might roll this into a JSON version of the survey field)
    username: Sequelize.STRING,      // Username, name of the user who administered the survey to them (again, probably roll into a survey JSON field)
    meta: Sequelize.JSON             // Any other data about the respondent we might want to keep at a *respondent* level
}, {
    tableName: 'pools',
    timestamps: true,
    createdAt: 'dateinserted',
    updatedAt: 'dateupdated'
});

exports.Pool = Pool;