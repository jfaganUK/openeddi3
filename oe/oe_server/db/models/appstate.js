/**
 * Created by jfagan on 3/25/15.
 * oe/oe_server/db/models/appstate.js
 * The AppState model. I want to keep a record of use of the site. I want to store the current
 *
 */

var Sequelize = require('sequelize');
var sequelize = require('../config');

var AppState = sequelize.define('AppState', {
    id: { 
        type: Sequelize.STRING,   // unique id of the appstate
        primaryKey: true
    },
    session: Sequelize.STRING,    // The session key of the person
    username: Sequelize.STRING,   // The username, if available of the person
    page: Sequelize.STRING,       // The page / section of the application they are on
    poolid: Sequelize.STRING,    // The pool they are on
    puid: Sequelize.STRING,       // The unique id for the pool collection occasion
    sheetid: Sequelize.STRING,    // The sheet they are on
    err: Sequelize.JSON           // For tracking error encountered in the system
}, {
    tableName: 'appstate',
    timestamps: true,
    createdAt: 'datecreated',
    updatedAt: 'lastupdated'
});

exports.AppState = AppState;
