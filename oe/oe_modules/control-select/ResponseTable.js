/**
 * Created by jfagan on 6/17/15.
 * oe/oe_modules/control-select/ResponseTable.js:3
 */

var Response = require('../../oe_server/db/models/_list').Response;
var log = require('util').log;
var _ = require('lodash');

function oeselectResponseTable(poolid, eddi, callback) {
    var vec = {};
    Response.findAll({where: {poolid: poolid, eid: eddi.eid}})
        .then(function (rs) {
            vec[eddi.title] = _.pluck(_.pluck(rs, 'response'), 'value');
            callback(vec);
        })
        .catch(function (err) {
            log('[oeselectResponseTable] Error!');
            console.error(err);
        });
}
module.exports = oeselectResponseTable;