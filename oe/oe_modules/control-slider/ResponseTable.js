/**
 * Created by jfagan on 6/18/15.
 * oe/oe_modules/control-slider/ResponseTable.js
 */

var Response = require('../../oe_server/db/models/_list').Response;
var log = require('util').log;
var _ = require('lodash');

function sliderResponseTable(poolid, eddi, callback) {
    var vec = {}, vecKey, valueVec, arrVal;

    Response.findAll({where: {poolid: poolid, eid: eddi.eid}})
        .then(function (rs) {
            var values = _.pluck(_.pluck(rs, 'response'), 'value');
            var arrayPrompts = eddi.arrayPrompts;

            // The slider control can have an array of sliders or not. So check.
            if (arrayPrompts) {
                for (var i = 0; i < arrayPrompts.length; i++) {
                    arrVal = arrayPrompts[i].value || arrayPrompts[i].id;
                    vecKey = eddi.title + '__' + arrVal;
                    valueVec = [];
                    for (var j = 0; j < values.length; j++) {
                        valueVec.push(values[j][i]);
                    }
                    vec[vecKey] = valueVec;
                }
            } else {
                vec[eddi.title] = _.pluck(_.pluck(rs, 'response'), 'value');
            }

            callback(vec);
        })
        .catch(function (err) {
            log('[sliderResponseTable] Error!');
            console.error(err);
        });
}
module.exports = sliderResponseTable;
