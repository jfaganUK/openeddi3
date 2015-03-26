/**
 * Created by jfagan on 3/25/15.
 *
 */

var Sequelize   = require('sequelize');
var pg          = require('pg');

var sequelize = new Sequelize('openeddi', 'openeddi', 'openeddi', {
    dialect: 'postgres'
});

module.exports = sequelize;