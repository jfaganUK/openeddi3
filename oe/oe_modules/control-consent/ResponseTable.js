/**
 * Created by jfagan on 6/17/15.
 * oe/oe_modules/control-consent/ResponseTable.js
 */

var Response = require('../../oe_server/db/models/_list').Response;
var log = require('util').log;
var _ = require('lodash');

function consentResponseTable(poolid, eddi, callback) {
    var vec = {};
    Response.findAll({where: {poolid: poolid, eid: eddi.eid}})
        .then(function (rs) {
            vec[eddi.title] = _(rs).pluck('response').pluck('value').value();
            callback(vec);
        })
        .catch(function (err) {
            log('[consentResponseTable] Error!');
            console.error(err);
        });
}
module.exports = consentResponseTable;