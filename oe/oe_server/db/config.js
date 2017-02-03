/**
 * Created by jfagan on 3/25/15.
 *
 */

var Sequelize   = require('sequelize');
var pg          = require('pg');
var log = require('util').log;

var sequelize = new Sequelize(
    OEConfig.db.database,
    OEConfig.db.username,
    OEConfig.db.password,
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: function (str) {
            //do nothing, it's way too noisy!
        }
    });

module.exports = sequelize;