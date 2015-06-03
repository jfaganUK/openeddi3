/**
 * Created by jfagan on 6/1/15.
 * oe/oe_server/db/models/session.js:3
 */

var Sequelize = require('sequelize');
var sequelize = require('../config');

var Session = sequelize.define('Session', {
    sid: Sequelize.STRING,
    sess: Sequelize.JSON,
    expire: Sequelize.DATE
}, {
    tableName: 'session',
    timestamps: true
});

exports.Session = Session;