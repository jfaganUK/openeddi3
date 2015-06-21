/**
 * Created by jfagan on 6/19/15.
 * oe/oe_modules/control-basic-nameinterpret/NameDetailResponseTable.js:3
 */

var _ = require('lodash');
// This does not read the database, it takes response data as given and then returns
// a parsed object for the response table
function getResponseTable(eddi, response) {
    var o = {};
    switch (eddi.niEddi) {
        case 'radiolist':
            o = parseNIRadiolist(eddi, response);
            break;
        case 'checklist':
            o = parseNIChecklist(eddi, response);
            break;
        default:
            break;
    }
    return (o);
}
module.exports = getResponseTable;

function parseNIRadiolist(eddi, response) {
    var o = {};
    var ap = eddi.niEddiDetails.arrayPrompts;
    if (response) {
        o[eddi.title] = _.result(_.findWhere(ap, {arrayid: response.value}), 'prompt');
    } else {
        // the default value if no response is provided
        o[eddi.title] = "NA";
    }
    return (o)
}

function parseNIChecklist(eddi, response) {
    var o = {};
    var ap = eddi.niEddiDetails.arrayPrompts;

    // make sure there's a column for each array option, default it to false (since they're checkboxes)
    _.each(ap, function (a) {
        var k = eddi.title + '__' + a.value;
        // if no responses is provided it will default all to false
        o[k] = false;
        if (response && response.value.hasOwnProperty(a.arrayid)) {
            o[k] = response.value[a.arrayid];
        }
    });

    return (o);
}