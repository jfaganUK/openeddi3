/**
 * Created by jfagan on 11/3/15.
 * oe/oe_modules/control-ni-boxpop/NameDetailResponseTable.js:3
 */

var _ = require('lodash');

// This does not read the database, it takes response data as given and then returns
// a parsed object for the response table
function getResponseTable(eddi, response) {
    var o = {};

    var ap = eddi.arrayPrompts;
    if (response) {
        //o[eddi.title] = _.result(_.findWhere(ap, {arrayid: response}), 'prompt');
        o[eddi.title] = response.value;
        if (eddi.other) {
            o[eddi.title + '__other'] = response.other;
        }
    } else {
        // the default value if no response is provided
        o[eddi.title] = "NA";
        if (eddi.other) {
            o[eddi.title + '__other'] = "";
        }
    }

    return (o);
}
module.exports = getResponseTable;
