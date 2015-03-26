/**
 * Created by jfagan on 3/25/15.
 * Preveiously this was the "Respondent" model. But I want to be able to have multiple pools for a single respondent.
 * So this is now the 'pool' model. It represents a single occasion of data collection on a particular pool.
 */

var Sequelize = require('sequelize');
var sequelize = require('../config');

var Pool = sequelize.define('Pool', {
    id: Sequelize.STRING,          // A guid
    datecreated: Sequelize.DATE,   // The client creation date and the date inserted can be very different if the data is synced at a later date
    ipaddress: Sequelize.STRING,   // The ipaddress they were tracked from
    pool: Sequelize.STRING,        // What pool they took (note, may change this to a JSON field in case of multiple surveys)
    poolstatus: Sequelize.STRING,  //What is the current status of the survey they are taking?
    poollogic: Sequelize.JSON,     // The logic of the survey they took
    sheetlogic: Sequelize.JSON,    // The group logic of the survey they took
    sheetid: Sequelize.INTEGER,    // The last page they were on of the survey (again, might roll this into a JSON version of the survey field)
    username: Sequelize.STRING,    // Username, name of the user who administered the survey to them (again, probably roll into a survey JSON field)
    meta: Sequelize.JSON           // Any other data about the respondent we might want to keep at a *respondent* level
}, {
    tableName: 'pools',
    timestamps: true,
    createdAt: 'dateinserted',
    updatedAt: 'dateupdated'
});

exports.Pool = Pool;