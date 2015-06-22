/**
 * Created by jfagan on 6/21/15.
 * oe/oe_server/db/models/pooldesign.js:3
 */

var Sequelize = require('sequelize');
var sequelize = require('../config');
var guid = require('../../helpers/guid');

var PoolDesign = sequelize.define('PoolDesign', {
    pdid: { // pool design id, a unique identifier for this specific
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: guid
    },
    poolid: Sequelize.STRING,  // The id of the pool being worked on
    poollogic: Sequelize.JSON,    // The logic of the pool
    username: Sequelize.STRING,  // Username, the name of the person who saved this edit
    meta: Sequelize.JSON     // Any other data about the pool we might want to save
}, {
    tableName: 'pooldesign',
    timestamps: true,
    createdAt: 'dateinserted'
});

exports.PoolDesign = PoolDesign;
