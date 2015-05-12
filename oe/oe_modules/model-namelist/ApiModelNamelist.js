/**
 * Created by jfagan on 4/27/15.
 * oe/oe_modules/model-namelist/ApiModelNamelist.js
 */

var Sequelize = require('sequelize');
var sequelize = require('../../oe_server/db/config');
var guid = require('../../oe_server/helpers/guid');

module.exports = sequelize.define('Namelist', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: guid
    },
    puid: Sequelize.STRING,        // The pool responses
    poolid: Sequelize.STRING,      // The pool name
    name: Sequelize.STRING,        // The name of the person / entity
    lists: Sequelize.JSON,      // The lists that the name belongs to
    details: Sequelize.JSON        // Details of the name (including ties)
}, {
    tableName: 'namelist',
    timestamps: true,
    createdAt: 'datecreated',
    updatedAt: 'lastupdated'
});