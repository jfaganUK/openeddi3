/**
 * Created by jfagan on 6/17/15.
 * /oe/oe_modules/control-checklist/ResponseTable
 */


var Response = require('../../oe_server/db/models/_list').Response;
var log = require('util').log;
var _ = require('lodash');

function checklistResponseTable(poolid, eddi, callback) {
    var vec = {}, vecKey, valueVec;
    Response.findAll({where: {poolid: poolid, eid: eddi.eid}})
        .then(function (rs) {
            var values = _.pluck(_.pluck(rs, 'response'), 'value');
            var arrayPrompts = eddi.arrayPrompts;

            for (var i = 0; i < arrayPrompts.length; i++) {
                vecKey = eddi.title + '__' + arrayPrompts[i].value;
                valueVec = [];
                for (var j = 0; j < values.length; j++) {
                    // if there was no response, fill it all with false
                    if (_.isNull(values[j])) {
                        valueVec.push(false);
                    } else {
                        valueVec.push(values[j][i]);

                    }
                }
                vec[vecKey] = valueVec;
            }

            if (eddi.other) {
                vecKey = eddi.title + '__Other';
                vec[vecKey] = _(rs).pluck('response').pluck('other').pluck('text').value();
            }
            callback(vec);
        })
        .catch(function (err) {
            log('[checklistResponseTable] Error!');
            console.error(err);
        });
}
module.exports = checklistResponseTable;




